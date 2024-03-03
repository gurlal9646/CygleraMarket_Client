import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceListingComponent } from './service-listing/service-listing.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';
import { ServiceListingBuyerComponent } from './service-listing-buyer/service-listing-buyer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ServiceListingBuyerComponent,ServiceListingComponent, ManageServicesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'seller',
        component: ServiceListingComponent
      }, 
      {
        path: 'buyer',
        component: ServiceListingBuyerComponent
      },  
      {
        path: 'add',
        component: ManageServicesComponent
      },
      {
        path:'editservice/:serviceId',
        component:ManageServicesComponent
      }
    ]),
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class ServicesModule { }
