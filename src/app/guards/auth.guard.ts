import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  user: UserModel;
  constructor(private router: Router, private authService: AuthService) {
    this.user = this.authService.getcurrentUserValue();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.user.token !== '') {
        return true;     
    }
    this.router.navigate(['/error/401']); // Redirect to error page if token is not available
    return false;
  }
}
