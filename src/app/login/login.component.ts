import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
export type UserType = UserModel | undefined;
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  returnUrl: string;
  user: UserModel;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  otp: string = '';
  @ViewChild('otpModal')
  otpModal: TemplateRef<any>;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  constructor(
    private fb: FormBuilder,
    private _loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    // redirect to home if already logged in
    if (this.authService.getcurrentUserValue().token) {
      this.router.navigate(['/dashboard']);
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
      roleId: ['0'],
    });
  }

  async submit() {
    this.isLoading$.next(true);
    const response = await this._loginService.generateToken(
      this.loginForm.value
    );
    if (response.code == 1) {
      this.user = response.data;
      this.modalService.open(this.otpModal, this.modalConfig);
    } else if (response.subcode == 2) {
      this.showLoginOptions();
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

  showLoginOptions() {
    Swal.fire({
      position: 'center',
      icon: 'info',
      title: 'Please select your account type:',
      showConfirmButton: false,
      showCloseButton: true,
      html: `
        <div style="text-align: center;">
          <button class="swal2-confirm swal2-styled swal-button--buyer">Buyer</button>
          <button class="swal2-confirm swal2-styled swal-button--seller">Seller</button>
        </div>
      `,
    });

    // Handling button clicks using event delegation
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('swal-button--buyer')) {
        // Perform action for Buyer
        this.loginForm.get('roleId')?.setValue(1);
        Swal.close();
        this.submit();
      } else if (target.classList.contains('swal-button--seller')) {
        // Perform action for Seller
        this.loginForm.get('roleId')?.setValue(2);
        Swal.close();
        this.submit();
      }
    });
  }

  async verifyOtp(myForm: NgForm) {
    this.isLoading$.next(true);

    if (myForm && myForm.invalid) {
      return;
    }

    let request = {
      email: this.loginForm.get('email')?.value,
      otp: this.otp,
    };

    const response = await this._loginService.validateOTP(request);
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
