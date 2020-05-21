import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';

import { AppSettings } from './app-settings';

import { AppRoutingModule } from './app-routing.module';
import { AppRouterActivate } from './app.router.activate';
import { CurrencyPipe } from '@angular/common';

import { RouterModule, Routes, RouteReuseStrategy } from '@angular/router';


import { AppComponent } from './app.component';
import { SoftwareRouteReuseStrategy } from './software/software-route-reuse-strategy';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AppSettings,
    AppRouterActivate,
    CurrencyPipe,
    { provide: RouteReuseStrategy, useClass: SoftwareRouteReuseStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
