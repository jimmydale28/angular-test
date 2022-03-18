import '../polyfills';

import {HttpClientModule} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DragndropComponent } from './dragndrop/dragndrop.component';
import { CdkFormDragComponent } from './cdk-form-drag/cdk-form-drag.component';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { BackendComponent } from './backend/backend.component';


@NgModule({
  declarations: [
    AppComponent,
    DragndropComponent,
    CdkFormDragComponent,
    BackendComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    DragDropModule,
  ],
  exports: [
  ],
  providers: [BackendComponent],
  bootstrap: [AppComponent],
  entryComponents: [CdkFormDragComponent]
})
export class AppModule { 
  //platformBrowserDynamic().bootstrapModule(AppModule);
}
