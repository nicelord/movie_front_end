import { Injectable } from '@angular/core';
import {Http, Response} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";

@Injectable()
export class ProductServiceService {

  constructor(private http:Http) { }

  getProducts(){
    return this.http.get('http://localhost:8084/test-rest01/webresources/api/products')
      .map((response: Response)=> response.json());
  }

  testError(){
    return this.http.get('http://localhost:8084/test-rest01/webresources/api/ok')
      .map((response: Response)=> response.json())
      .catch(this.handleError);
  }

  handleError(error: any){
    return Observable.throw(error);
  }
}
