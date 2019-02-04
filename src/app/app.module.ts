import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { ToastrModule } from 'ngx-toastr';

import { AppSettings } from './app-settings';

import { AppRoutingModule } from './app-routing.module';
import { AppRouterActivate } from './app.router.activate';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: true
    }),
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    AppSettings,
    AppRouterActivate
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
