import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; 

  // public fields
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  getcurrentUserValue(): UserModel {
    const storedModel = localStorage.getItem('currentuser');
    return storedModel ? JSON.parse(storedModel) : new UserModel();
  }

  setcurrentUserValue(user: UserModel) {
    localStorage.setItem('currentuser', JSON.stringify(user));
  }

  constructor(
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }



  logout() {
    localStorage.clear();
    this.router.navigate(['/login'], {
      queryParams: {},
    });
  }


  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
