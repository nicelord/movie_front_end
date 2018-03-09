import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";
import {factoryOrValue} from "rxjs/operator/multicast";
import {AppSettings} from "../app-settings";

@Injectable()
export class MovieService {

  constructor(private http:Http) { }

  getMovies(type:string){
    return this.http.get(AppSettings.API_ENDPOINT+'/movie/latest/'+type)
      .map((response: Response)=> response.json());
  }

  getMoviesByGenre(genre){
    return this.http.get(AppSettings.API_ENDPOINT+'/movie/genre/'+genre.replace(/-/g,' '))
      .map((response: Response)=> response.json());
  }

  getMoviesBy(by:string, value:string, page:number, sort?:string){
    return this.http.get(AppSettings.API_ENDPOINT+'/movie/'+by+'/'+(by!='genre'&&by!='quality'?value.replace(/-/g,'%20'):value)+'/'+page,{params: {'sort': sort}})
      .map((response: Response)=> response.json());
  }


  getMoviesById(id){
    return this.http.get(AppSettings.API_ENDPOINT+'/movie/detail/'+id)
      .map((response: Response)=> response.json());
  }

  getMoviesByPlaylist(id){
    return this.http.get(AppSettings.API_ENDPOINT+'/movie/playlist/'+id)
      .map((response: Response)=> response.json());
  }

  handleError(error: any){
    return Observable.throw(error);
  }

}
