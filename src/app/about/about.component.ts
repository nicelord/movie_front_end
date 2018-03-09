import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {Meta, Title, DomSanitizer} from '@angular/platform-browser';
import {Jsonp, Http} from "@angular/http";
import {HttpClient} from "@angular/common/http";
import {JwplayerService} from "../services/jwplayer.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit,AfterViewInit {
  player : any;

  constructor(private jwplayer: JwplayerService,
              public sanitizer: DomSanitizer,
              private http: Http) {

  }

  ngOnInit() {
    (<any>window).onYouTubeIframeAPIReady = () => {
      this.player = new (<any>window).YT.Player('player-iframe', {
        playerVars: {
          status: 'ok',
          allow_embed: 1,
          controls: 1,
          ps: 'docs',
          partnerid: 30,
          autoplay: 0,
          showinfo: 0,
          public: false,
          enablejsapi: 1,
          docid: '12y9XvRZfGtVtrc4WL_8jQ5LBY1yYBfoE'
        },
        events: {
          'onReady': () => {
          },
          'onStateChange': () => {
          }
        }
      });

      const player = (<any>window).document.getElementById('player-iframe');
      player.src = player.src.replace("embed/", "embed%2F");

    };

  }

  test(){
    this.http.get('http://localhost:8084/movie_end_point/webresources/movie/gostream_token')
      .subscribe((data) => {
        console.log(data.json().playlist[0].sources[0].file);
        this.jwplayer.test(data.json().playlist[0].sources[0].file);
      });

    // this.jwplayer.test('https://streaming.lemonstream.me:1443/1e0c79a1b90dbc296ef507f5ebb476eb1511301917/127.0.0.1/playlist.m3u8?ggdomain=MTUxMTMwMTkxNw==&ggvideo=MTUxMTMwMTkxNw==&cookie=MTUxMTMwMTkxNw==&link=LzE3LzlkLzE3OWRhZTQ2YTNiMmU5YmFiM2MyOWI4OWQ4NjM2YTJjLTcyMC5tcDQ=');
  }
  ngAfterViewInit() {
    const doc = (<any>window).document;
    let playerApiScript = doc.createElement('script');
    playerApiScript.type = 'text/javascript';
    playerApiScript.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApiScript);
  }
}
