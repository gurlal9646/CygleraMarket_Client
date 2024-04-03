import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LoginService } from '../services/login.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmPasswordValidator } from '../signup/confirm-password.validator';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss',
})
export class ResetpasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  userId: string;
  token: string;
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router:Router
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    this.userId = this.route.snapshot.params['UserId'];
    this.token = this.route.snapshot.params['Token'];
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetPasswordForm.controls;
  }

  initForm() {
    this.resetPasswordForm = this.fb.group(
      {
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

  async submit() {
    this.isLoading$.next(true);
    const response = await this.loginService.resetPassword(
      this.userId,this.token,this.resetPasswordForm.value
    );
    if (response.code === 1) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.message,
        showCloseButton: false,
        showConfirmButton:false,
        timer:3000
      });
      this.router.navigateByUrl('/login');

    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: response.message,
        showCloseButton: false,
        showConfirmButton:false,
        timer:3000
      });
      this.isLoading$.next(false);
    }
    this.isLoading$.next(false);
  }
}
