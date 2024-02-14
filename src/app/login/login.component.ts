import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
export type UserType = UserModel | undefined;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  user: UserType;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private _loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private authService:AuthService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.getcurrentUserValue()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }


  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
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
      roleId:[
        '0'
      ]
    });
  }


  async submit() {
    this.hasError = false;
    this.spinner.show();
    const loginResponse = await this._loginService.generateToken(
      this.loginForm.value
    );
    if (loginResponse.code == 1) {
      this.user = {
        token:loginResponse.data.token,
        roleId: loginResponse.data.roleId,
        firstName: loginResponse.data.firstName,
        lastName: loginResponse.data.lastName
      };
      this.authService.setcurrentUserValue(this.user);
      this.router.navigate(['/dashboard']);
    } else if (loginResponse.subcode == 2) {
      this.showLoginOptions();
    }
    else{
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: loginResponse.message,
        showCloseButton:true,
      });
    }

    this.spinner.hide();
  }

  
  showLoginOptions() {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: 'Please select your account type:',
      showConfirmButton: false,
      showCloseButton:true,
      html: `
        <div style="text-align: center;">
          <button class="swal2-confirm swal2-styled swal-button--buyer">Buyer</button>
          <button class="swal2-confirm swal2-styled swal-button--seller">Seller</button>
          <button class="swal2-confirm swal2-styled swal-button--admin">Admin</button>
        </div>
      `
    });

    // Handling button clicks using event delegation
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('swal-button--buyer')) {
        // Perform action for Buyer
        console.log('Buyer selected');
        this.loginForm.get('roleId')?.setValue(1);
        Swal.close();
        this.submit();
      } else if (target.classList.contains('swal-button--seller')) {
        // Perform action for Seller
        console.log('Seller selected');
        this.loginForm.get('roleId')?.setValue(2);
        Swal.close();
        this.submit();
      } else if (target.classList.contains('swal-button--admin')) {
        // Perform action for Admin
        console.log('Admin selected');
        this.loginForm.get('roleId')?.setValue(10);
        Swal.close();
        this.submit();
      }
    
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
