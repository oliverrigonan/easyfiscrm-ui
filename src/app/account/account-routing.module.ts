import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AppRouterActivate } from '../app.router.activate';

import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, canActivate: [AppRouterActivate],
    children: [
      { path: '', component: LoginComponent, canActivate: [AppRouterActivate] },
      { path: 'login', component: LoginComponent, canActivate: [AppRouterActivate] }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
