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
import { ProductService } from 'src/app/services/product.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import { RequestForApprovalService } from 'src/app/services/rfa.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EntityType } from 'src/app/models/Enums';
import { CygleraService } from 'src/app/services/cygleraservice.service';
@Component({
  selector: 'app-service-listing-buyer',
  templateUrl: './service-listing-buyer.component.html',
  styleUrl: './service-listing-buyer.component.scss'
})
export class ServiceListingBuyerComponent implements OnInit, AfterViewInit, OnDestroy {
  serviceList: any = [];
  isLoading = false;
  quantity: number = 0;
  isCollapsed1 = false;
  fromDate:Date = new Date();
  toDate:Date;

  @ViewChild('formModal')
  formModal: TemplateRef<any>;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private clickListener: () => void;
  serviceId: any;
  sellerId: any;
  price: any;

  constructor(
    private cygleraService: CygleraService,
    private modalService: NgbModal,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private rfaService: RequestForApprovalService,
    private router:Router
  ) {}

  ngAfterViewInit(): void {
    if (this.clickListener) {
      this.clickListener(); // Remove the previous event listener
    }
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn');
      if (closestBtn) {
        const { action,serviceid,sellerid,price } = closestBtn.dataset;
        switch (action) {
          case 'addQuantity':
            this.serviceId = serviceid;
            this.sellerId = sellerid;
            this.price = price;
            console.log(this.serviceId);
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
    const response = await this.cygleraService.getServices();
    if (response.code == 1) {
      this.serviceList = response.data;
      this.cdr.detectChanges();
    }
  }

  async onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    const request = {
      type:EntityType.SERVICE,
      itemUniqueId:this.serviceId,
      sellerUniqueId:this.sellerId,
      quantity: myForm.value['quantity'],
      price: myForm.value['quantity'] * this.price
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
}
