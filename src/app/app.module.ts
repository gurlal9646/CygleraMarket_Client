import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginService } from './services/login.service';
import { BuyerService } from './services/buyer.service';
import { SellerService } from './services/seller.service';
import { ProductService } from './services/product.service';
import {  TokenInterceptor } from './guards/auth.http';
import { AgGridModule } from "ag-grid-angular";
import { AuthService } from './services/auth.service';
import { CygleraService } from './services/cygleraservice.service';
import { RequestForApprovalService } from './services/rfa.service';
import { ProgramService } from './services/program.service';
import { ApprovalService } from './services/approval.service';




@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    AgGridModule
  
  ],
  providers: [
    LoginService,
    BuyerService,
    SellerService,
    ProductService,
    AuthService,
    CygleraService,
    RequestForApprovalService,
    ProgramService,
    ApprovalService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }

  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
