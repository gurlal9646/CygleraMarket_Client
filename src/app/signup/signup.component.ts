import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { phone } from 'phone';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { SellerService } from 'src/app/services/seller.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { UserModel } from 'src/app/models/user.model';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { BuyerService } from '../services/buyer.service';
import { NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit, OnDestroy {
  user: UserModel;
  registrationForm: FormGroup;
  hasError: boolean;
  postalCodePattern =
    /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$|^\d{5}$/i;
  countries = [
    {
      name: 'Canada',
      states: [
        { state: 'Ontario', cities: ['Toronto', 'Mississauga'] },
        { state: 'British Columbia', cities: ['Surrey', 'Vancouver'] },
      ],
    },
    {
      name: 'USA',
      states: [
        { state: 'New York', cities: ['New York'] },
        { state: 'California', cities: ['Los Angles'] },
      ],
    },
    // Add more countries with their cities and states
  ];
  otp: string = '';
  @ViewChild('otpModal')
  otpModal: TemplateRef<any>;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  userType: any;
  heading: string = '';
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sellerService: SellerService,
    private buyerService: BuyerService,
    private authService: AuthService,
    private _avRoute: ActivatedRoute,
    private loginService:LoginService,
    private modalService: NgbModal
  ) {
    this.userType = this._avRoute.snapshot.params['userType'];
    this.heading = this.userType;
    const loadingSubscr = this.isLoading$
    .asObservable()
    .subscribe((res) => (this.isLoading = res));
   this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        firstName: [
          '',
          Validators.compose([Validators.required, Validators.maxLength(100)]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(3),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
        countryCode: [''],
        phoneNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        companyName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        category: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        status: [1, Validators.compose([Validators.required])],
        companySize: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        businessNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        streetAddress: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        city: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        state: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        country: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        postalCode: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(this.postalCodePattern),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );

    // Watch for changes in the selected country and update the available states
    this.registrationForm.get('country')!.valueChanges.subscribe((country) => {
      const selectedCountry = this.countries.find((c) => c.name === country);
      this.registrationForm.get('state')!.setValue('');
      this.registrationForm.get('city')!.setValue('');

      if (selectedCountry) {
        this.registrationForm
          .get('state')!
          .setValidators([Validators.required]);
        this.registrationForm.get('state')!.updateValueAndValidity();
      } else {
        this.registrationForm.get('state')!.clearValidators();
        this.registrationForm.get('state')!.updateValueAndValidity();
      }
    });

    // Watch for changes in the selected state and update the available cities
    this.registrationForm.get('state')!.valueChanges.subscribe((state) => {
      const selectedCountry = this.countries.find(
        (c) => c.name === this.registrationForm.get('country')!.value
      );

      if (selectedCountry) {
        const selectedState = selectedCountry.states.find((s) => s === state);
        this.registrationForm.get('city')!.setValue('');

        this.registrationForm.get('city')!.setValidators([Validators.required]);
        this.registrationForm.get('city')!.updateValueAndValidity();
      }
    });
  }

  async submit() {
    this.isLoading$.next(true);

    this.hasError = false;
    let phoneResult = phone(this.registrationForm.get('phoneNumber')?.value);
    if (!phoneResult.isValid) {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Invalid phone number',
        timer: 2000,
      });
      this.isLoading$.next(false);
      return;
    }

    this.registrationForm.get('phoneNumber')?.setValue(phoneResult.phoneNumber);
    this.registrationForm.get('countryCode')?.setValue(phoneResult.countryCode);

    let response: ApiResponse = new ApiResponse();
    if (this.userType === 'seller') {
      response = await this.sellerService.register(this.registrationForm.value);
    } else if (this.userType === 'buyer') {
      response = await this.buyerService.register(this.registrationForm.value);
    }
    if (response.code == 1) {
      this.user = response.data;
      this.modalService.open(this.otpModal, this.modalConfig);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: response.message,
        showCloseButton: true,
      });
      this.isLoading$.next(false);
    }
    this.isLoading$.next(false);

  }

  getCountriesStates(
    selectedCountry: string
  ): { state: string; cities: string[] }[] {
    const country = this.countries.find((c) => c.name === selectedCountry);
    return country?.states || [];
  }

  getStatesCities(selectedCountry: string, selectedState: string): string[] {
    const country = this.countries.find((c) => c.name === selectedCountry);
    const city = country?.states.find((s) => s.state === selectedState);
    return city ? city.cities : [];
  }

  async verifyOtp(myForm: NgForm) {
    this.isLoading$.next(true);

    if (myForm && myForm.invalid) {
      return;
    }

    let request = {
      email: this.registrationForm.get('email')?.value,
      otp: this.otp,
    };

    const response = await this.loginService.validateOTP(request);
    if (response.code == 1) {
      this.modalService.dismissAll();
      this.authService.setcurrentUserValue(this.user);
      this.router.navigate(['/dashboard']);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: response.message,
        showCloseButton: true,
      });
      this.isLoading$.next(false);
    }

    this.isLoading$.next(false);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
