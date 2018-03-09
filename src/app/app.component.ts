import {Component, OnInit, Input} from '@angular/core';
import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {AppSettings} from "./app-settings";
import {ActivatedRoute, Router, RouterStateSnapshot} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app works!';
  genres:string[] = [];
  years:string[] = [];
  qualities:string[] = [];
  tags:string[]=[];
  searchString = '';
  sort: string = 'recent_post';

  constructor(private http:Http, public router: Router,public route: ActivatedRoute){

  }

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      if(params['sort']!=null){
        this.sort = params['sort'];
      }else{
        this.sort = 'recent_post';
      }
    });


    this.http.get(AppSettings.API_ENDPOINT+'/movie/genres')
      .map(res => res.json())
      .catch(error => Observable.throw(error))
      .subscribe(
        data => {
          this.genres = data;
        },
        error => {

        }
      );

    this.http.get(AppSettings.API_ENDPOINT+'/movie/years')
      .map(res => res.json())
      .catch(error => Observable.throw(error))
      .subscribe(
        data => {
          this.years = data;
        },
        error => {

        }
      )

    this.http.get(AppSettings.API_ENDPOINT+'/movie/qualities')
      .map(res => res.json())
      .catch(error => Observable.throw(error))
      .subscribe(
        data => {
          this.qualities = data;
        },
        error => {

        }
      )

  }

  doSearch(){
    this.router.navigate(['/movies/title/', this.searchString,1],{ queryParams: { sort: this.sort } });
    this.searchString = '';
  }
}


