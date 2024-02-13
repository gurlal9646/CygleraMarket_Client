import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard  {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = localStorage.getItem('token');
    if (currentUser) {
      // logged in so return true
      return true;
    }
    this.router.navigate(['/error/401']); // Redirect to error page if token is not available
    return false;
  }
}
