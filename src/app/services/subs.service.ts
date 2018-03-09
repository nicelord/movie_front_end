import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import {AppSettings} from "../app-settings";

@Injectable()
export class SubsService {

  constructor(private http:Http) { }

  loadSubsFromUrl(urlx: String){
    return this.http.get(AppSettings.API_ENDPOINT+'/subs/external_loader/'+urlx)
      .map((response: Response)=> response.json());
  }

}
