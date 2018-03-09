import {
  Component, OnDestroy
} from '@angular/core';
import {SubsService} from "../../services/subs.service";
import {Subscription, Observable} from "rxjs";
import {JwplayerService} from "../../services/jwplayer.service";
import {Headers, RequestOptions, Http} from "@angular/http";
import {AppSettings} from "../../app-settings";

@Component({
  selector: 'app-modal-subtitles',
  templateUrl: './modal-subtitles.component.html',
  styleUrls: ['./modal-subtitles.component.css']
})
export class ModalSubtitlesComponent implements OnDestroy{

  public visible = false;
  public visibleAnimate = false;
  urlx : String;
  substitles: any[] = [];
  subscSubs : Subscription;
  isLoading = false;
  message : String = "";

  constructor(private subsService: SubsService,private jwplayer: JwplayerService, private http:Http) {}

  public show(): void {
    this.jwplayer.loadCurrentCaptionList().then(
      (data)=> {
          this.substitles = data;
      }
    );

    this.message = "";
    this.urlx = "";
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);

  }

  public hide() {
    this.clearAllSub();
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public hideAndPlay(subtitle:any) {
    this.jwplayer.setUpNewSubList(this.substitles,subtitle);
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  clearAllSub(){
    if(this.substitles.length>0){
      for(let subs of this.substitles){
        this.http.delete('http://localhost:8084/test-rest01/webresources/subs/sub_sign/'+subs.signature)
          .subscribe();
      }
    }
  }

  public loadUrl(){
    if(this.urlx !== ''){
      this.clearAllSub();
      this.message = "";
      this.isLoading = true;
      this.subscSubs = this.subsService.loadSubsFromUrl(this.urlx).subscribe(
        (data) => {
          this.isLoading = false;
          this.substitles = data;
        },
        (error : any) => {
          this.isLoading = false;
          if(error.status == 0){
            this.message = 'Server is down!';
          }else{
            this.message = error.json().error;
          }
        }
      );
    }
  }

  files : FileList = null;
  getFiles(event){

    this.files = event.target.files;

    if(this.files.length > 0) {
      if(this.files[0].size>1000000){
        this.files = null;
        alert('file size is more than 1000000 bytes');
        return;
      }
      this.clearAllSub();
      this.message = "";
      this.isLoading = true;
      let file: File = this.files[0];
      let formData:FormData = new FormData();
      formData.append('file', file, file.name);

      let headers = new Headers();
      /** No need to include Content-Type in Angular 4 */
      let options = new RequestOptions({ headers: headers });
      this.http.post(AppSettings.API_ENDPOINT+'/subs/external_loader/upload', formData, options)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
          data => {
            this.isLoading = false;
            this.substitles = data;
          },
          error => {
            this.isLoading = false;
            if(error.status == 0){
              this.message = 'Server is down!';
            }else{
              this.message = error.json().error;
            }
            this.files = null;
          }
        )

    }
  }



  ngOnDestroy() {
  }
}
