import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceListingComponent } from './service-listing/service-listing.component';
import { ManageServicesComponent } from './manage-services/manage-services.component';



@NgModule({
  declarations: [ServiceListingComponent, ManageServicesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ServiceListingComponent
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
  ]
})
export class ServicesModule { }
