import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';



@NgModule({
  declarations: [ProductListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductListingComponent
      },   
      {
        path: 'add',
        component: ManageProductsComponent
      }
    ]),
    AgGridModule,
    FormsModule // Add FormsModule to imports

  ]
})
export class ProductsModule { }
