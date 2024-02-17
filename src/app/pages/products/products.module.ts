import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';
import { ProductListingBuyerComponent } from './product-listing-buyer/product-listing-buyer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ProductListingComponent,ProductListingBuyerComponent,ManageProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'seller',
        component: ProductListingComponent
      },   
      {
        path: 'buyer',
        component: ProductListingBuyerComponent
      },  
      {
        path: 'add',
        component: ManageProductsComponent
      },
      {
        path:'editproduct/:productId',
        component:ManageProductsComponent
      }
    ]),
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule


  ]
})
export class ProductsModule { }
