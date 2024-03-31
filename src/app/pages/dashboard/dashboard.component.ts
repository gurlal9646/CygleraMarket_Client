import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { ProductService } from 'src/app/services/product.service';
import { CygleraService } from 'src/app/services/cygleraservice.service';
import { RequestForApprovalService } from 'src/app/services/rfa.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel',
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  productCount: number = 0;
  serviceCount: number = 0;
  apiCallsCompleted: boolean = false;
  total: number = 0;
  approved: number = 0;
  rejected: number = 0;
  pending: number = 0;
  productList:any=[];
  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cygleraService: CygleraService,
    private rfaService: RequestForApprovalService,
  ) {}

  async ngOnInit() {
    await this.getProducts();
    await this.getServices();
    await this.getRequestCount();
    await this.getLatestProducts();
    this.apiCallsCompleted = true;
    this.cdr.detectChanges();
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  async getProducts() {
    const response = await this.productService.getProducts();
    if (response.code == 1) {
      this.productCount = response.data.length;
    }
  }
  async getServices() {
    const response = await this.cygleraService.getServices();
    if (response.code == 1) {
      this.serviceCount = response.data.length;
    }
  }

  async getRequestCount() {
    const response = await this.rfaService.getRequestCount();
    if (response.code == 1) {
      this.total = response.data.total;
      this.approved = response.data.approved;
      this.pending = response.data.pending;
      this.rejected = response.data.rejected;
    }
  }

  async getLatestProducts() {
    const response = await this.productService.getLatestProducts();
    if (response.code == 1) {
     this.productList = response.data;
    }
  }
}
