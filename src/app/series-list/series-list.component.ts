import {Component, OnInit, Input, OnDestroy, OnChanges} from '@angular/core';
import {Movie} from "../models/movie";
import {Subscription} from "rxjs";
import {MovieService} from "../services/movie.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-series-list',
  templateUrl: './series-list.component.html',
  styleUrls: ['./series-list.component.css']
})
export class SeriesListComponent implements OnInit,OnDestroy,OnChanges {
  @Input() public movie: any = "";
  moviePlaylist : Movie[] = [];

  isLoading = true;
  sub1 : Subscription;
  message: string;

  constructor(private movieService: MovieService) {

  }

  ngOnInit() {
  }

  ngOnChanges(){
    try{
      this.sub1 = this.movieService.getMoviesByPlaylist(this.movie.playlist.playlistId).subscribe(
        (data: any) => {
          this.isLoading = false;
          this.moviePlaylist = data;
        }
      );
    }catch (e){

    }
  }

  ngOnDestroy() {
    //this.sub1.unsubscribe();

  }

}
