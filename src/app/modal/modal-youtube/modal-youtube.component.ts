import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-modal-youtube',
  templateUrl: './modal-youtube.component.html',
  styles: [`
    .modal {
      background: rgba(0,0,0,0.6);
    }
  `],
})
export class ModalYoutubeComponent implements OnInit {

  public visible = false;
  public visibleAnimate = false;
  private embedUrl = 'https://www.youtube.com/embed/';
  private safeUrl;


  constructor(public sanitizer: DomSanitizer) {
  }

  public show(ytId: string): void {
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true);
    this.embedUrl = this.embedUrl+ytId;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.embedUrl);

  }

  public hide(): void {
    this.visibleAnimate = false;
    this.embedUrl = 'https://www.youtube.com/embed/';
    setTimeout(() => this.visible = false, 300);
  }


  ngOnInit() {
  }



}
