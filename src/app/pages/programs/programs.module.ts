import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProgramListingComponent } from './program-listing/program-listing.component';
import { ManageProgramsComponent } from './manage-programs/manage-programs.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProgramListingComponent, ManageProgramsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProgramListingComponent
      },   
      {
        path: 'add',
        component: ManageProgramsComponent
      },
      {
        path:'editservice/:serviceId',
        component:ManageProgramsComponent
      }
    ]),
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProgramsModule { }
