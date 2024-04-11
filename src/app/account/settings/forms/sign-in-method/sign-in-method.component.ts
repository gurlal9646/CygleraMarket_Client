import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from 'src/app/services/login.service';
import { ConfirmPasswordValidator } from 'src/app/signup/confirm-password.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-in-method',
  templateUrl: './sign-in-method.component.html',
})
export class SignInMethodComponent implements OnInit, OnDestroy {
  showChangeEmailForm: boolean = false;
  showChangePasswordForm: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  email: string = '';
  emailForm: FormGroup;
  passwordForm: FormGroup;
  user: UserModel;

  constructor(
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.emailForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.initForm();
  }

  initForm() {
    this.passwordForm = this.fb.group(
      {
        currentPassword: [
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
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  async getUserDetails() {
    const response = await this.loginService.getUserDetails();
    if (response.code == 1) {
      this.email = response.data.email;
      this.emailForm.get('email')?.setValue(this.email);
      this.cdr.detectChanges();
    }
  }

  toggleEmailForm(show: boolean) {
    this.showChangeEmailForm = show;
  }

  async saveEmail() {
    this.isLoading$.next(true);
    const response = await this.loginService.updateUserDetails(
      this.emailForm.value
    );
    if (response.code == 1) {
      this.getUserDetails();
      this.isLoading$.next(false);
      this.showChangeEmailForm = false;
      const currentUserJSON = localStorage.getItem('currentuser');
      this.user.email = this.emailForm.get('email')?.value;
      this.authService.setcurrentUserValue(this.user);
      this.cdr.detectChanges();
    }
  }

  togglePasswordForm(show: boolean) {
    this.showChangePasswordForm = show;
  }

  async savePassword() {
    this.isLoading$.next(true);
    const response = await this.loginService.changePassword(
      this.passwordForm.value
    );
    if (response.code == 1) {
      this.getUserDetails();
      this.isLoading$.next(false);
      this.showChangePasswordForm = false;
      this.passwordForm.reset();
      this.cdr.detectChanges();
    } else {
      this.isLoading$.next(false);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: response.message,
        showConfirmButton: false,
        timer: 5000,
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
