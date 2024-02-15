import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ManageProductsComponent } from './manage-products/manage-products.component';



@NgModule({
  declarations: [ProductListingComponent,ManageProductsComponent],
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
    FormsModule,
    ReactiveFormsModule,


  ]
})
export class ProductsModule { }
