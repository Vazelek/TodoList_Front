import { Routes } from '@angular/router';
import { HomeComponent } from './feature/home/component/home/home.component';
import { ListComponent } from './feature/list/component/list/list.component';

export const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "list/:id", component: ListComponent},
];
