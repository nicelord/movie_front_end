import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import {AuthenticationService} from "./services/authentication.service";
import {AuthGuardService} from "./services/auth-guard.service";
import {UserService} from "./services/user.service";
import {MovieService} from "./services/movie.service";
import {JwplayerService} from "./services/jwplayer.service";
import {SubsService} from "./services/subs.service";
import {MovieComponent} from "./movie/movie.component";
import {MovieDetailComponent} from "./movie-detail/movie-detail.component";
import {ModalSubtitlesComponent} from "./modal/modal-subtitles/modal-subtitles.component";
import {ModalYoutubeComponent} from "./modal/modal-youtube/modal-youtube.component";
import {ModalLoginComponent} from "./modal/modal-login/modal-login.component";
import {ContainerComponent} from "./container/container.component";
import {LimitTextPipe} from "./util/limit-text.pipe";
import {SeriesListComponent} from "./series-list/series-list.component";
import {TimedisplayPipe} from "./pipes/timedisplay.pipe";
import {GroupbyPipe} from "./pipes/groupby.pipe";
import {MovieSidebarComponent} from "./movie-sidebar/movie-sidebar.component";
import {CustomUrlSerializer} from "./util/CustomUrlSerializer";
import {UrlSerializer} from "@angular/router";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    MovieComponent,
    MovieDetailComponent,
    ModalSubtitlesComponent,
    ModalYoutubeComponent,
    ModalLoginComponent,
    ContainerComponent,
    LimitTextPipe,
    SeriesListComponent,
    TimedisplayPipe,
    GroupbyPipe,
    MovieSidebarComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'ang4-seo'}),
    FormsModule,
    HttpModule,
    AppRoutingModule,
    JsonpModule,
    LazyLoadImageModule
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    UserService,
    MovieService,
    JwplayerService,
    SubsService,
    { provide: UrlSerializer, useClass: CustomUrlSerializer }
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }

