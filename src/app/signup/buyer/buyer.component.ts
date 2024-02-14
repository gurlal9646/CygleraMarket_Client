import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { phone } from 'phone';
import { ApiResponse } from 'src/app/models/ApiResponse';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { BuyerService } from 'src/app/services/buyer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrl: './buyer.component.scss',
})
export class BuyerComponent implements OnInit {
  user:UserModel;
  registrationForm: FormGroup;
  hasError: boolean;
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

  constructor(private fb: FormBuilder, private router: Router,private _buyerService:BuyerService,
    private authService:AuthService) {}

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group({
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
          Validators.minLength(3),
          Validators.maxLength(100),
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
    });

    // Watch for changes in the selected country and update the available states
    this.registrationForm.get('country')!.valueChanges.subscribe((country) => {
      const selectedCountry = this.countries.find((c) => c.name === country);
      this.registrationForm.get('state')!.setValue(null);
      this.registrationForm.get('city')!.setValue(null);

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
        this.registrationForm.get('city')!.setValue(null);

        this.registrationForm
            .get('city')!
            .setValidators([Validators.required]);
          this.registrationForm.get('city')!.updateValueAndValidity();
      }
    });
  }

  async submit() {
    this.hasError = false;
    let phoneResult = phone('(817) 569-8900');


    const response:ApiResponse = await this._buyerService.register(this.registrationForm.value);
    if(response.code == 1){
      this.user = {
        token:response.data.token,
        roleId: response.data.roleId,
        firstName: response.data.firstName,
        lastName: response.data.lastName
      };
      this.authService.setcurrentUserValue(this.user);
      this.router.navigate(['/dashboard']);
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: response.message,
        showCloseButton:true,
      });
    }
  }

  getCountriesStates(selectedCountry: string): { state: string, cities: string[] }[] {
    const country = this.countries.find((c) => c.name === selectedCountry);
    return country?.states || [];
  }

  getStatesCities(selectedCountry: string, selectedState: string): string[] {
    const country = this.countries.find((c) => c.name === selectedCountry);
    const city = country?.states.find((s) => s.state === selectedState);
    return city ? city.cities : [];
  }

}
