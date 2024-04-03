import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ApprovalListingComponent } from './approval-listing/approval-listing.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BuyerApprovalListingComponent } from './buyer-approval-listing/buyer-approval-listing.component';
import { NegotiationConversationComponent } from './negotiation-conversation/negotiation-conversation.component';



@NgModule({
    declarations: [ApprovalListingComponent, BuyerApprovalListingComponent,NegotiationConversationComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'buyer',
                component: BuyerApprovalListingComponent
            },
            {
                path: 'seller',
                component: ApprovalListingComponent
            }
        ]),
        AgGridModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule    ]
})
export class RequestforapprovalModule { }
