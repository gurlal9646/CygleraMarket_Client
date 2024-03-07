import {  Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { ProgramService } from 'src/app/services/program.service';
import moment from 'moment';

@Component({
  selector: 'app-manage-programs',
  templateUrl: './manage-programs.component.html',
  styleUrl: './manage-programs.component.scss'
})
export class ManageProgramsComponent implements OnInit, OnDestroy {
  programForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  programId: string = '';
  heading: string = 'Add';
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private _avRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private programService:ProgramService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.programForm = this.fb.group({
      programId: '',
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      startDate: ['', Validators.compose([Validators.required])],
      endDate: ['', Validators.compose([Validators.required])]
    });

    this.programId = this._avRoute.snapshot.params['programId'];
    console.log(this.programId);
  }

  ngOnInit(): void {
    if (this.programId) {
      this.heading = 'Edit';
      this.getProductDetails(this.programId);
    }
  }
  
  async getProductDetails(id: string) {
    try {
      const response = await this.programService.getProgramById(id);
      if(response.code == 1){
        this.programForm.patchValue(response.data[0]); 
        this.programForm.get('startDate')?.setValue(moment(response.data[0].startDate).format('YYYY-MM-DD'));
        this.programForm.get('endDate')?.setValue(moment(response.data[0].endDate).format('YYYY-MM-DD'));
        this.cdr.detectChanges();  
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveProgram() {
    this.isLoading$.next(true);
    const response = await this.programService.addProgram(
      this.programForm.value
    );
    if (response.code == 1) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.message,
        showConfirmButton: false,
        timer: 5000,
      });
      this.router.navigate(['/programs/seller']);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: response.message,
        timer: 5000,
      });
    }
    this.isLoading$.next(false);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
