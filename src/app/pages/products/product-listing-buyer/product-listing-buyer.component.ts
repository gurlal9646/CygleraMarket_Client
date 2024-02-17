import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-product-listing-buyer',
  templateUrl: './product-listing-buyer.component.html',
  styleUrl: './product-listing-buyer.component.scss'
})
export class ProductListingBuyerComponent implements  OnInit {
  productList: any =[];
  isLoading = false;
  quantity:number = 0;
  isCollapsed1 = false;

  @ViewChild('formModal')
  formModal: TemplateRef<any>;
  
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private clickListener: () => void;

  constructor(private productService:ProductService, private modalService: NgbModal,private renderer: Renderer2){
    
  }

  ngAfterViewInit(): void {
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn');
      if (closestBtn) {
        const { action } = closestBtn.dataset;
        switch (action) {

          case 'addQuantity':
            this.addQuantity();
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
    const response = await this.productService.getProducts();
    if (response.code == 1) {
      this.productList = response.data;
      console.log(this.productList);
    }
  }

  onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
  }

  addQuantity() {
    this.quantity = 0;
    this.modalService.open(this.formModal, this.modalConfig);

  }

}
