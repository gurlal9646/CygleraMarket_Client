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

@Component({
  selector: 'app-program-listing-buyer',
  templateUrl: './program-listing-buyer.component.html',
  styleUrl: './program-listing-buyer.component.scss'
})
export class ProgramListingBuyerComponent implements OnInit, AfterViewInit, OnDestroy {
  programList: any = [];
  isLoading = false;
  quantity: number = 0;
  isCollapsed1 = false;

  @ViewChild('formModal')
  formModal: TemplateRef<any>;

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private clickListener: () => void;
  programId: any;
  sellerId: any;
  price: any;

  constructor(
    private programService: ProgramService,
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
        const { action,programid,sellerid,price } = closestBtn.dataset;
        console.log(programid);
        switch (action) {
          case 'addQuantity':
            this.programId = programid;
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
    const response = await this.programService.getPrograms();
    if (response.code == 1) {
      this.programList = response.data;
      this.cdr.detectChanges();
    }
  }

  async onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    const request = {
      type:EntityType.PROGRAM,
      itemId:this.programId,
      sellerId:this.sellerId,
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
