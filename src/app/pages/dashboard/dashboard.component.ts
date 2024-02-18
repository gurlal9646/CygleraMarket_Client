import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ModalConfig, ModalComponent } from '../../_metronic/partials';
import { ProductService } from 'src/app/services/product.service';
import { CygleraService } from 'src/app/services/cygleraservice.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  modalConfig: ModalConfig = {
    modalTitle: 'Modal title',
    dismissButtonLabel: 'Submit',
    closeButtonLabel: 'Cancel'
  };
  @ViewChild('modal') private modalComponent: ModalComponent;
  productCount:number = 0;
  serviceCount:number = 0;
  apiCallsCompleted: boolean = false;
  constructor(private productService:ProductService,private cdr:ChangeDetectorRef,
    private cygleraService:CygleraService) {}

  async ngOnInit(){
    await this.getProducts();
    await this.getServices();
    this.apiCallsCompleted = true;
    this.cdr.detectChanges();
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  async getProducts(){
    const response = await this.productService.getProducts();
    if(response.code == 1){
      this.productCount = response.data.length;
    }
  }
  async getServices(){
    const response = await this.cygleraService.getServices();
    if(response.code == 1){
      this.serviceCount = response.data.length;
    }
  }
  

}

