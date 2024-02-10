import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';
import { DataTablesModule } from 'angular-datatables';



@NgModule({
  declarations: [ProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProductsComponent,
      },
    ]),
    DataTablesModule
  ]
})
export class ProductsModule { }
