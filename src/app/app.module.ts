import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { NgxLoadingModule } from 'ngx-loading';


import { AppComponent } from './app.component';
import { SearchToolbarComponent } from './search-toolbar/search-toolbar.component';
import { ContentComponent } from './content/content.component';
import { MatIconRegistry } from '@angular/material';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';

@NgModule({
  declarations: [
    AppComponent,
    SearchToolbarComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ScrollDispatchModule,
    NgxLoadingModule.forRoot({})
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi_used.svg'));
    registerLocaleData(localeIt);
  }
 }
