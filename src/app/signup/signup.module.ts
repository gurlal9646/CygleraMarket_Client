import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupRoutingModule } from './signup-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BuyerComponent } from './buyer/buyer.component';
import { SellerComponent } from './seller/seller.component';



@NgModule({
  declarations: [
    BuyerComponent,
    SellerComponent
  ],
  imports: [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule
  ]
})
export class SignupModule { }
