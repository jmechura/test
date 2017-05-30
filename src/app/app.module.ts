import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IconButtonComponent } from './shared/components/icon-button/icon-button.component';
import { ButtonComponent } from './shared/components/button/button.component';
import { InputComponent } from './shared/components/input/input.component';
import { SelectComponent } from './shared/components/select/select.component';
import { AvatarComponent } from './shared/components/avatar/avatar.component';
import { UploadInputComponent } from './shared/components/upload-input/upload-input.component';

@NgModule({
  declarations: [
    AppComponent,
    IconButtonComponent,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    AvatarComponent,
    UploadInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
