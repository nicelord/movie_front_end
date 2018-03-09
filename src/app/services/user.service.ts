import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from "@angular/http";
import {AuthenticationService} from "./authentication.service";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Injectable()
export class UserService {

  constructor(private http: Http, private auth: AuthenticationService) {
  }

  getUsers(): Observable<User[]> {
    // add authorization header with jwt token
    let headers = new Headers({'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('currentUser')).token});
    let options = new RequestOptions({headers: headers});

    // get users from api
    return this.http.get('http://localhost:8084/test-rest01/webresources/api/protected', options)
      .map((response: Response) => response.json())
      .catch(this.handleError);
  }

  handleError(error: any){
    return Observable.throw(error);
  }

}
