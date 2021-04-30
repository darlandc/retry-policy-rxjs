import { ProductService } from './services/product.service';
import { ProductComponent } from './components/product/product.component';
import { TestData } from './test-data';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalHttpInterceptorService } from './services/interceptor.service';
import { GlobalErrorHandlerService } from './services/error-handler.service';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    InMemoryWebApiModule.forRoot(TestData)
  ],
    providers: [
        ProductService,
        { provide: HTTP_INTERCEPTORS, useClass: GlobalHttpInterceptorService, multi: true  },
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService }
    ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
