import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { ResetpasswordComponent } from '../resetpassword/resetpassword.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetpasswordComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    NgbModule
  ]
})
export class LoginModule { }
