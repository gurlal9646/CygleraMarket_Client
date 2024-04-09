import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

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

  constructor(
    private cdr: ChangeDetectorRef,
    private loginService: LoginService,
    private fb: FormBuilder
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
      this.cdr.detectChanges();
    } 
  }

  togglePasswordForm(show: boolean) {
    this.showChangePasswordForm = show;
  }

  savePassword() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.showChangePasswordForm = false;
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
