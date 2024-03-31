import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-buyer-contract-listing',
  templateUrl: './buyer-contract-listing.component.html',
  styleUrl: './buyer-contract-listing.component.scss'
})
export class BuyerContractListingComponent
  implements OnInit
{
  contractList: any = [];
  isLoading = false;
  quantity: number = 0;
  isCollapsed1 = false;
  isDrawer: false;
  productId: any;
  sellerId: any;
  price: any;
  conversationList: any = [];
  user: UserModel;
  requestId: string = '';

  constructor(
    private contractService: ContractService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {
    this.user = this.authService.getcurrentUserValue();
  }


  async ngOnInit() {
    await this.GetContracts();
  }

  async GetContracts() {
    const response = await this.contractService.getContracts();
    if (response.code == 1) {
      this.contractList = response.data;
      this.cdr.detectChanges();
    }
  }

  acceptContract(contractId:string){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to accept this contract?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reject it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const request = {
          status: 'Approved by buyer',
        };

      }
    });
  }

}
