import { CommonModule, registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePT from '@angular/common/locales/pt';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { HomeModule } from './pages/home/home.module';
import { ToastrModule } from 'ngx-toastr';
import { NgxMaskModule } from 'ngx-mask';
import { SavingsModule } from './pages/savings/savings.module';
import { NgChartsModule } from 'ng2-charts';

registerLocaleData(localePT)


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      preventDuplicates: true,
      countDuplicates: true
    }),
    NgxMaskModule.forRoot(),
    NgChartsModule.forRoot(),
    HomeModule,
    SavingsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
