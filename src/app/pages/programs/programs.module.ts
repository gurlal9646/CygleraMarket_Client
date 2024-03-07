import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgramListingComponent } from './program-listing/program-listing.component';
import { ManageProgramsComponent } from './manage-programs/manage-programs.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgramListingBuyerComponent } from './program-listing-buyer/program-listing-buyer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ProgramListingComponent, ManageProgramsComponent, ProgramListingBuyerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'seller',
        component: ProgramListingComponent
      },   
      {
        path: 'buyer',
        component: ProgramListingBuyerComponent
      }, 
      {
        path: 'add',
        component: ManageProgramsComponent
      },
      {
        path:'editprogram/:programId',
        component:ManageProgramsComponent
      }
    ]),
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class ProgramsModule { }
