// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;

  // Simulate authentication logic
  login() {
    this.isAuthenticated = true;
  }

  // Simulate logout logic
  logout() {
    this.isAuthenticated = false;
  }

  // Check if the user is authenticated
  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  getAccessToken():String{
    return `eyakdsnlndsds`;
  }
}
