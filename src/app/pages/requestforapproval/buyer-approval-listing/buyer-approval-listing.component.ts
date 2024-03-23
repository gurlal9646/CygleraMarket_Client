import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { RequestForApprovalService } from 'src/app/services/rfa.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EntityType } from 'src/app/models/Enums';
import { ProgramService } from 'src/app/services/program.service';
import { ApprovalService } from 'src/app/services/approval.service';
import moment from 'moment';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-buyer-approval-listing',
  templateUrl: './buyer-approval-listing.component.html',
  styleUrl: './buyer-approval-listing.component.scss',
})
export class BuyerApprovalListingComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  approvalList: any = [];
  isLoading = false;
  quantity: number = 0;
  isCollapsed1 = false;
  isDrawer: false;

  @ViewChild('formModal')
  formModal: TemplateRef<any>;
  @ViewChild('negotiationModal')
  negotiationModal: TemplateRef<any>;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private clickListener: () => void;
  productId: any;
  sellerId: any;
  price: any;
  conversationList: any = [];
  newMessage: string = '';
  user: UserModel;
  requestId: string = '';

  constructor(
    private approvalService: ApprovalService,
    private modalService: NgbModal,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private rfaService: RequestForApprovalService,
    private router: Router,
    private authService: AuthService
  ) {
    this.user = this.authService.getcurrentUserValue();
  }

  ngAfterViewInit(): void {
    if (this.clickListener) {
      this.clickListener(); // Remove the previous event listener
    }
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn');
      if (closestBtn) {
        const { action, productid, sellerid, price } = closestBtn.dataset;
        switch (action) {
          case 'addQuantity':
            this.productId = productid;
            this.sellerId = sellerid;
            this.price = price;
            this.modalService.open(this.formModal, this.modalConfig);
            break;

          case 'delete':
            break;
        }
      }
    });
  }

  async ngOnInit() {
    await this.GetProducts();
  }

  async GetProducts() {
    const response = await this.approvalService.getApprovals();
    if (response.code == 1) {
      this.approvalList = response.data;
      for (let i of this.approvalList) {
        if (i.type === 2) {
          i.duration = this.calculateDays(i.startDate, i.endDate);
        }
      }
      this.cdr.detectChanges();
    }
  }

  calculateDays(sDate: any, eDate: any) {
    const startDate = new Date(sDate);
    const endDate = new Date(eDate);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
  }

  async onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    const request = {
      type: EntityType.PROGRAM,
      itemUniqueId: this.productId,
      sellerUniqueId: this.sellerId,
      quantity: myForm.value['quantity'],
      price: myForm.value['quantity'] * this.price,
    };

    const response = await this.rfaService.addRequest(request);
    if (response.code == 1) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.message,
        showConfirmButton: false,
        timer: 5000,
      });
      this.modalService.dismissAll();
      this.ngOnInit();
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: response.message,
        timer: 5000,
      });
    }
  }
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.modalService.dismissAll();
  }

  async reviewNegotiation(requestId: any) {
    this.modalService.open(this.negotiationModal, this.modalConfig);
    this.requestId = requestId;
    this.getConversation(requestId);
  }

  async sendMessage() {
    const request = {
      requestId: this.requestId,
      message: this.newMessage,
      buyerId: this.user.uniqueId,
    };
    const response = await this.rfaService.addConversation(request);
    if (response.code == 1) {
      this.newMessage = '';
      await this.getConversation(this.requestId);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: response.message,
        timer: 5000,
      });
    }
  }

  getMessageCssClass(message: any): string {
    return `p-5 rounded text-gray-900 fw-bold mw-lg-400px bg-light-${
      message.sellerId !== '' ? 'info' : 'primary'
    } text-${message.sellerId !== '' ? 'start' : 'end'}`;
  }

  async getConversation(requestId: any) {
    const response = await this.rfaService.getConversation(requestId);
    if (response.code == 1) {
      this.conversationList = response.data;
      for (let message of this.conversationList) {
        message.time = moment(message.createdAt).fromNow();
      }
    } else {
      this.conversationList = [];
    }
  }
}
