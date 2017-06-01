import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BronzeComponentsModule } from './shared/components/bronze/bronze-components.module';
import { SilverComponentsModule } from 'app/shared/components/silver/silver-components.module';
import { GoldComponentsModule } from './shared/components/gold/gold-components.module';
import { ShowcaseComponent } from './showcase/showcase.component';
import { PlatformComponent } from './platform/platform.component';

@NgModule({
  declarations: [
    AppComponent,
    ShowcaseComponent,
    PlatformComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,

    BronzeComponentsModule,
    SilverComponentsModule,
    GoldComponentsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
