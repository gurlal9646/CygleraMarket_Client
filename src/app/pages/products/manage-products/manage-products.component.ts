import {  Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss',
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  productId: string = '';
  heading: string = 'Add';
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private _avRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.productForm = this.fb.group({
      productId: 0,
      name: ['', Validators.compose([Validators.required])],
      description: ['', Validators.compose([Validators.required])],
      price: ['', Validators.compose([Validators.required])],
      category: ['', Validators.compose([Validators.required])],
      manufacturer: ['', Validators.compose([Validators.required])],      
      stockQuantity: [
        '',
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
      expiryDate: [''],
    });

    this.productId = this._avRoute.snapshot.params['productId'];
    console.log(this.productId);
  }

  ngOnInit(): void {
    if (this.productId) {
      this.heading = 'Edit';
      this.getProductDetails(this.productId);
    }
  }
  
  async getProductDetails(id: string) {
    try {
      const response = await this.productService.getProductById(id);
      if(response.code == 1){
        this.productForm.patchValue(response.data[0]);    
        this.cdr.detectChanges();  
      }
    } catch (error) {
      console.log(error);
    }
  }

  async saveProduct() {
    this.isLoading$.next(true);
    const response = await this.productService.addProduct(
      this.productForm.value
    );
    if (response.code == 1) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.message,
        showConfirmButton: false,
        timer: 5000,
      });
      this.router.navigate(['/products']);
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
