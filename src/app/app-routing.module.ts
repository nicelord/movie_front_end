import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import {MovieDetailComponent} from "./movie-detail/movie-detail.component";
import {ContainerComponent} from "./container/container.component";

const routes: Routes = [
  {path: '',component: ContainerComponent},
  {path: 'about',component: AboutComponent},
  {path: 'movie/:id/watch', component: MovieDetailComponent,pathMatch: 'full'},
  {path: 'movies/latest/:type', component: ContainerComponent},
  {path: 'movies/:by/:value/:page', component: ContainerComponent,pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
