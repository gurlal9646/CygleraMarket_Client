import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request contains a No-Auth header
    if (request.headers.has('No-Auth')) {
      return next.handle(request); // Pass the request without modification
    }
    

    // Check if token is available in local storage
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/error/401']); // Redirect to error page if token is not available
    }

    // Attach the token to the request
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
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
