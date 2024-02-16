import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  user:UserModel;
  constructor(private router: Router,
    private authService:AuthService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.user = this.authService.getcurrentUserValue();

    // Check if the request contains a No-Auth header
    if (request.headers.has('No-Auth')) {
      return next.handle(request); // Pass the request without modification
    }
    

    if (!this.user.token) {
      this.router.navigate(['/error/401']); // Redirect to error page if token is not available
    }

    // Attach the token to the request
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.user.token}`
      }
    });

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error handling request:', error);
        return throwError(error);
      })
    );
  }
}
