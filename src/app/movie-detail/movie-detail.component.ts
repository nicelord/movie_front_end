import {
  Component, OnInit, OnDestroy, Input, ViewChild, Inject, InjectionToken, AfterViewChecked,
  AfterViewInit, EventEmitter, Output
} from '@angular/core';
import {Subscription, Observable} from "rxjs";
import {ModalYoutubeComponent} from "../modal/modal-youtube/modal-youtube.component";
import {ModalSubtitlesComponent} from "../modal/modal-subtitles/modal-subtitles.component";
import {Movie} from "../models/movie";
import {ActivatedRoute} from "@angular/router";
import {MovieService} from "../services/movie.service";
import {JwplayerService} from "../services/jwplayer.service";
import {DomSanitizer, Title, Meta} from "@angular/platform-browser";
import {X} from "../util/X";
import {Buffer} from 'buffer';
import {Http, Jsonp} from "@angular/http";
import {async} from "rxjs/scheduler/async";


@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit, OnDestroy,AfterViewInit {

  @ViewChild(ModalYoutubeComponent)
  public readonly modalYoutube: ModalYoutubeComponent;
  @ViewChild(ModalSubtitlesComponent)
  public readonly modalSubtitles: ModalSubtitlesComponent;

  movies: Movie[] = [];
  movie: any;
  isLoading = true;
  sidebarLoading = true;
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  message: string;
  id: string;
  iframetag: any = "";
  showPlayer = false;
  showIframe = false;
  streamGroup: any[] = [];
  currentPlaying: any;
  playerError : boolean = false;
  playerLoading : boolean = true;
  noStream : boolean = false;

  constructor(private route: ActivatedRoute,
              private movieService: MovieService,
              private jwplayer: JwplayerService,
              public sanitizer: DomSanitizer,
              private meta: Meta, private title: Title) {
    // this.title.setTitle('Watch in HD for free');

  }

  changeSource(x: any) {
    this.playerError = false;
    this.currentPlaying = x;
    this.noStream = false;
    if (x.isIframe) {
      this.playerLoading = true;
      this.showPlayer = false;
      if (x.link.indexOf('drive.google.com') > -1) {
        this.initYTIframe(x.link.substring(x.link.indexOf('d/') + 2, x.link.lastIndexOf('/')));
      } else {
        this.showIframe = true;
        this.iframetag = this.sanitizer.bypassSecurityTrustResourceUrl(x.link);
        this.jwplayer.stopJwPlayer();
      }
    } else {
      this.showPlayer = true;
      this.showIframe = false;
      this.jwplayer.changeSource(x.directIndex);
      this.iframetag = "";
    }
  }

  initYTIframe(driveId: string) {
    const doc = (<any>window).document;
    if (doc.getElementById('playerApiScript') == null) {
      let playerApiScript = doc.createElement('script');
      playerApiScript.id = 'playerApiScript';
      playerApiScript.type = 'text/javascript';
      playerApiScript.src = 'https://www.youtube.com/iframe_api';
      doc.body.appendChild(playerApiScript);
    }

    this.showPlayer = false;
    this.showIframe = true;

    this.iframetag = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed%2F?status=ok&allow_embed=1&controls=1&ps=docs&partnerid=30&autoplay=0&showinfo=0&public=false&enablejsapi=1&docid=' + driveId + '&origin=http%3A%2F%2Flocalhost%3A4200&widgetid=1');
    (<any>window).onYouTubeIframeAPIReady = () => {
      new (<any>window).YT.Player('frameTag', {
        events: {
          'onReady': () => {
          },
          'onStateChange': () => {
          }
        }
      });

      this.jwplayer.stopJwPlayer();
    };
  }

  ngOnInit() {

    this.sub3 = this.route.params.subscribe(params => {
      this.id = params['id'];

      this.sub1 = this.movieService.getMoviesById(this.id).subscribe(
        (data: any) => {

          this.playerLoading = true;

          let m = JSON.parse(X.x0((Buffer.from(X.x0(data.kc), 'base64').toString('utf8').split('').reverse().join(''))));

          this.isLoading = false;
          this.movie = m;

          let tagName = m.tags.map(item => item.tagName);
          let actorName = m.cast.map(item => item.actorName);
          this.title.setTitle('Watch ' + m.title + ' (' + m.releaseYear + ') in HD for free | Fliix');
          this.meta.updateTag({
            name: 'keywords',
            content: m.title.toLocaleLowerCase() + ', ' + m.releaseYear + ', ' + tagName.join(', ') + actorName.join(', ').toLocaleLowerCase() + ' bluray, web-dl, 1080p, 720p, hd movie, online movie, 123movies, gostream, gomovies, putstream, freemovies, yts, 1337'
          });
          this.meta.updateTag({
            name: 'description',
            content: 'Watch and download ' + m.title + ' in HD for free ' + m.synopsis.replace(/<\/?[^>]+(>|$)/g, '').replace(/&rsquo;/g, "'").replace(/&#39;/g, "'")
          });

          if (this.movie.streamLinks.length > 0) {
            this.noStream = false;
            // grouping server
            let tmp: any[] = [];
            let linkdex: number = 0;
            let directIndex: number = 0;
            for (let s of this.movie.streamLinks) {
              tmp.push({
                serverSource: s.serverSource.serverName,
                link: s.link,
                isIframe: s.isIframe,
                quality: s.quality.quality,
                resolution: s.resolution.resolution,
                linkIndex: (s.link != null ? linkdex++ : null),
                directIndex: (s.isIframe ? null : directIndex++)
              });
            }

            this.streamGroup = this.groupBy(tmp, 'serverSource');

            // load jwplayer after movie initiated and pass the movie to jwplyr cofig
            var media = {
              title: this.movie.title,
              location: this.movie.streamLinks,
              image: this.movie.bigPosterLink,

            };

            this.jwplayer.loadMedia(media);

            this.changeSource(this.streamGroup[0].value[0]);

            this.jwplayer.getPlayer().then((playerInstance)=>{
              playerInstance.on('error',()=>{
                this.playerError = true;
                this.showPlayer = false;
              })

              playerInstance.on('ready',()=>{
                this.playerLoading = false;
              })

              playerInstance.on('levelsChanged',()=>{
                this.playerLoading = false;
              })

            });
          }else {
            this.playerLoading = false;
            this.showPlayer = false;
            this.showIframe = false;
            this.noStream = true;
          }

          this.sidebarLoading = true;
          this.sub2 = this.movieService.getMoviesBy('genre', this.movie.genres[Math.floor(Math.random() * this.movie.genres.length)].name.toLowerCase(), 1).subscribe(
            (data: any) => {
              let m = JSON.parse(X.x0((Buffer.from(X.x0(data.kc), 'base64').toString('utf8').split('').reverse().join(''))));
              this.sidebarLoading = false;
              this.movies = m.movies;
            },
            (error: any) => {
              this.sidebarLoading = false;
              if (error.status == 0) {
                this.message = 'Server is down!';
              } else {
                this.message = error.json().error;
              }
            }
          );

        },
        (error: any) => {
          this.isLoading = false;
          if (error.status == 0) {
            this.message = 'Server is down!';
          } else {
            this.message = error.json().error;
          }
        }
      );


    });
  }

  ngAfterViewInit(){
    this.jwplayer.getPlayer().then(playerInstance=>{
      playerInstance.on('error',function () {
        this.playerError = true;
        this.errorEvent.emit(this.playerError);
        console.log(this.playerError);
      })
    });
  }

  switchSubOff() {
    this.modalSubtitles.hide();
    this.jwplayer.switchSubOff();
  }

  changeSub() {
    this.jwplayer.changeSub();
  }

  ngOnDestroy() {
    this.sub1.unsubscribe();

  }


  groupBy(value: Array<any>, field: string): Array<any> {
    const groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({key, value: groupedObj[key]}));
  }

  onloadEmbed() {
    this.playerLoading = false;

  }


}
