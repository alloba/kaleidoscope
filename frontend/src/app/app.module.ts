import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { ImageDisplayComponent } from './image-display/image-display.component'
import {FormsModule} from "@angular/forms";
import { MetaInfoViewerComponent } from './meta-info-viewer/meta-info-viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageDisplayComponent,
    MetaInfoViewerComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
