import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import {ModalYoutubeComponent} from "../modal/modal-youtube/modal-youtube.component";
import {Title, Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.styles.css']
})
export class MovieComponent implements OnInit {
  @Input() movie: any;

  @ViewChild(ModalYoutubeComponent)
  public readonly modalYoutube: ModalYoutubeComponent;

  defaultImage = 'assets/images/no-thumb.png';
  image = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=200&url=';
  offset = 500;
  sort = 'recent_post';

  constructor(public router: Router, public route: ActivatedRoute) {
  }

  public testDownload() {
    // let file = new Blob(['https://subscene.com/subtitle/download?mac=eXh9Cquv6yLKSQQoIg8KHWSxdfnXLq4ceUW0Livfp9orwknONBv-UASzsnYCOEABLIpeFjpYYJmRjx8N11SYTX60Q2Nvyd5mL9Esi3YG8mmNzcJOCgfS-cXJx1L7odWM0'], { type: 'text/csv;charset=utf-8' });
    // FileSaver.saveAs(file, 'helloworld.csv')
    // //FileSaver.saveAs(new Blob(),'https://subscene.com/subtitle/download?mac=eXh9Cquv6yLKSQQoIg8KHWSxdfnXLq4ceUW0Livfp9orwknONBv-UASzsnYCOEABLIpeFjpYYJmRjx8N11SYTX60Q2Nvyd5mL9Esi3YG8mmNzcJOCgfS-cXJx1L7odWM0');
    //var zipFs = new zip.ZipReader();

  }


  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      if(params['sort']!=null){
        this.sort = params['sort'];
      }else{
        this.sort = 'recent_post';
      }
    });
  }


}
