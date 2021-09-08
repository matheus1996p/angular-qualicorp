import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./component/home/home.component";
import {PlanosComponent} from "./component/planos/planos.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'planos',
    component: PlanosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
