import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  registrationForm: FormGroup;
  user:UserModel;
  postalCodePattern = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$|^\d{5}$/i;
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
  constructor(
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private fb: FormBuilder,
    private authService:AuthService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.initForm();

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
        ]
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
        this.registrationForm.get('city')!.setValidators([Validators.required]);
        this.registrationForm.get('city')!.updateValueAndValidity();
      }
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  async getUserDetails() {
    const response = await this.loginService.getUserDetails();
    if (response.code == 1) {
      this.registrationForm.patchValue(response.data);
      this.registrationForm.get('state')?.setValue(response.data.state);
      this.registrationForm.get('city')?.setValue(response.data.city);
      this.cdr.detectChanges();

    }
  }


  async updateUserDetails(){
    this.isLoading$.next(true);
    const response = await this.loginService.updateUserDetails(this.registrationForm.value);
    if (response.code == 1) {
      this.getUserDetails();
      const currentUserJSON = localStorage.getItem('currentuser');
      this.user = currentUserJSON ? JSON.parse(currentUserJSON) : null;
      this.user.firstName = this.registrationForm.get('firstName')?.value;
      this.user.lastName = this.registrationForm.get('lastName')?.value;
      this.authService.setcurrentUserValue(this.user);
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }
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

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
