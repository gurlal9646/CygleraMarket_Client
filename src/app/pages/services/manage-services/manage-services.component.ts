import { Component,OnDestroy,OnInit } from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { BehaviorSubject,Subscription } from 'rxjs';
import { ServiceService} from '/api/service/getServices';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrl: './manage-services.component.scss'
})
export class ManageServicesComponent implements OnInit, OnDestroy {
  serviceForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  serviceId: string = '';
  heading: string = 'Add';
  constructor(
    private fb: FormBuilder,
    private serviceService: ServiceService,
    private router: Router,
    private _avRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.serviceForm = this.fb.group({
      serviceId: 0,
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
    });

    this.serviceId = this._avRoute.snapshot.params['serviceId'];
    console.log(this.serviceId);
  }

  ngOnInit(): void {
    if (this.serviceId) {
      this.heading = 'Edit';
      this.getServiceDetails(this.serviceId);
    }
  }

  async getServiceDetails(id: string) {
    try {
      const response = await this.serviceService.getServices(id);
      if(response.code == 1) {
        this.serviceForm.patchValue(response.data[0]);
        this.cdr.detectChanges();
      }
    } catch(error) {
      console.log(error);
    }
  }

  async saveService() {
    this.isLoading$.next(true);
    const response = await this.serviceService.Add (
        this.serviceForm.value
    );
    if(response.code == 1) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'response.message',
        showConfirmButton: false,
        timer: 5000,
      });
      this.router.navigate(['/services']);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'response.message',
        timer: 5000,
      });
    }
    this.isLoading$.next(false);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    
  }

}
