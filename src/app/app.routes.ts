import { Routes } from '@angular/router';
import { HomeComponent } from './feature/home/component/home/home.component';
import { ListComponent } from './feature/list/component/list/list.component';
import { SigninComponent } from './feature/signin/component/signin/signin.component';
import { SignupComponent } from './feature/signup/component/signup/signup.component';
import {AuthGuard} from './core/guard/auth.guard';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "list/:id",
    component: ListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "signin",
    component: SigninComponent
  },
  {
    path: "signup",
    component: SignupComponent
  },
];
