import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')!.value;
      const password = this.loginForm.get('password')!.value;

      // Implement your authentication logic here
      // For simplicity, let's assume a username 'admin' and password 'password'
      if (username === 'admin' && password === 'password') {
        // Navigate to the home page after successful login
        this.router.navigate(['/home']);
      } else {
        alert('Invalid username or password');
      }
    } else {
      alert('Please enter valid credentials');
    }
  }
}
