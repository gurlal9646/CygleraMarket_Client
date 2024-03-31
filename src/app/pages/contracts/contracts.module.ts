import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractListingComponent } from './contract-listing/contract-listing.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { BuyerContractListingComponent } from './buyer-contract-listing/buyer-contract-listing.component';



@NgModule({
  declarations: [BuyerContractListingComponent,ContractListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'buyer',
        component: BuyerContractListingComponent
    },
    {
        path: 'seller',
        component: ContractListingComponent
    }
    ]),
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ContractsModule { }
