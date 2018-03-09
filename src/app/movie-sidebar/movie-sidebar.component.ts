import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {ModalYoutubeComponent} from "../modal/modal-youtube/modal-youtube.component";

@Component({
  selector: 'app-movie-sidebar',
  templateUrl: 'movie-sidebar.component.html',
  styleUrls: ['movie-sidebar.component.css']
})
export class MovieSidebarComponent implements OnInit {

  @Input() movie: any;

  @ViewChild(ModalYoutubeComponent)
  public readonly modalYoutube: ModalYoutubeComponent;

  defaultImage = 'assets/images/no-thumb.png';
  image = 'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=200&url=';
  offset = 500;

  constructor() { }

  ngOnInit() {
  }


}
