import {Component, OnInit, OnDestroy} from '@angular/core';
import {Form} from "@angular/forms";
import {AuthenticationService} from "../../services/authentication.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {Http, Response} from "@angular/http";
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-modal-login',
  templateUrl: './modal-login.component.html',
  styles: [`
    input.ng-touched.ng-invalid{
        border: 1px solid #a94442;
        background-color: #f2dede;
    }
  `]
})
export class ModalLoginComponent implements OnInit,OnDestroy {
  public visible = false;
  public visibleAnimate = false;
  username: string;
  password: string;
  error = '';
  loginSuccess = false;
  isLoading = false;
  subscription: Subscription;

  constructor(private http: Http, private auth: AuthenticationService, private router: Router) {
    console.log('constructor called');
  }

  public show(): void {
    console.log('show modal Login');
    try {
      let username = JSON.parse(localStorage.getItem('currentUser')).username;
      let token = JSON.parse(localStorage.getItem('currentUser')).token
      if (username != null || token != null) {
        this.http.get('http://localhost:8084/test-rest01/webresources/api/verify?username=' + username + '&token=' + token)
          .toPromise()
          .then(response => {
            console.log(response.json().result);
            if (response.json().result == true) {
              this.visible = false;
            } else {
              localStorage.removeItem('currentUser');
              this.visible = true;
              setTimeout(() => this.visibleAnimate = true);
            }
          }).catch((e) => {
            if(e.status == 0){
              console.log('unable to connect');
              this.visible = false;
            }
        })
      }
    } catch (e) {
      this.visible = true;
      setTimeout(() => this.visibleAnimate = true);
    }
  }

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  ngOnInit() {

    console.log('on init called');

  }

  doLogin() {
    this.isLoading = true;
    this.error = '';
    this.auth.login(this.username, this.password).subscribe(
      (result => {
        if (result === true) {
          this.loginSuccess = true;
          setTimeout(() => this.hide(), 1000);
          this.router.navigate(['/protected']);
        } else {
          this.error = 'Username or password is incorrect!';
        }
        this.isLoading = false;
      }),
      (error: any) => {
        if (error.status == 0) {
          this.error = 'Server is down!';
        } else {
          this.error = error.json().error;
        }
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
