import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription, Observable} from "rxjs";
import {Router, ActivatedRoute} from "@angular/router";
import {Movie} from "../models/movie";
import {MovieService} from "../services/movie.service";
import {Title, Meta} from "@angular/platform-browser";
import {X} from "../util/X";
import {Buffer} from 'buffer';


@Component({
  selector: 'app-container',
  templateUrl: './container.component.html'
})
export class ContainerComponent implements OnInit,OnDestroy {

  movies: Movie[] = [];
  tvs: Movie[] = [];
  isLoading = true;
  subscription: Subscription;
  message: string;
  by: string;
  page: number;
  value: string;
  totalPage: number[];
  curPage: number;
  paging: number[];
  sort: string = 'recent_post';
  obsCombined: Observable<any>;

  constructor(public route: ActivatedRoute,
              public router: Router,
              public movieService: MovieService,
              private meta: Meta, private title: Title) {
    title.setTitle("Watch free movie online - Fliix")

  }

  ngOnInit() {


    this.obsCombined = Observable.combineLatest(
      this.route.params, this.route.queryParams, (params: any, qParams: any) => ({params, qParams})
    );
    this.obsCombined.subscribe(res => {
      this.by = res.params['by'];
      this.value = res.params['value'];
      this.page = res.params['page'];
      if (res.qParams['sort'] != null) {
        this.sort = res.qParams['sort'];
      } else {
        this.sort = 'recent_post';
      }


      if (this.router.url.startsWith('/movies/') && !this.router.url.startsWith('/movies/latest')) {
        this.isLoading = true;
        this.movieService.getMoviesBy(this.by, this.value, this.page, this.sort).subscribe(
          (data: any) => {
            let m = JSON.parse(X.x0((Buffer.from(X.x0(data.kc), 'base64').toString('ascii').split('').reverse().join(''))));
            this.isLoading = false;
            this.movies = m.movies;
            this.totalPage = Array.apply(null, {length: m.totalPage}).map(Number.call, Number);
            this.curPage = m.curPage;
            this.paging = this.totalPage.filter((data) => data % 5 == 0);
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
      } else {
        this.movieService.getMovies('cinema').subscribe(
          (data: any) => {
            let m = JSON.parse(X.x0((Buffer.from(X.x0(data.kc), 'base64').toString('ascii').split('').reverse().join(''))));
            this.isLoading = false;
            this.movies = m.movies.filter(data => data.type === 'cinema');

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

        this.movieService.getMovies('tv').subscribe(
          (data: any) => {
            let m = JSON.parse(X.x0((Buffer.from(X.x0(data.kc), 'base64').toString('ascii').split('').reverse().join(''))));
            this.isLoading = false;
            this.tvs = m.movies.filter(data => data.type === 'tv');
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
      }
    });
  }

  uriFormat(x: string) {
    return x.replace(/-/g, ' ');
  }

  ngOnDestroy() {

    try {
      this.subscription.unsubscribe();
    } catch (e) {

    }

  }

  paginate(curPage: number): number[] {

    if (curPage >= 5) {
      if (curPage % 2 == 1) {
        return this.totalPage.slice(curPage - 3, curPage + 2);
      } else {
        return this.totalPage.slice(curPage - 4, curPage + 1);
      }
    }
    return this.totalPage.slice(0, 5);

  }

}
