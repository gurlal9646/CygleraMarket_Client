import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ApprovalListingComponent } from './approval-listing/approval-listing.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [ApprovalListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ApprovalListingComponent
      }
    ]),
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule
  ]
})
export class RequestforapprovalModule { }
