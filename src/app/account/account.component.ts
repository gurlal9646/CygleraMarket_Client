import { Component, OnInit } from '@angular/core';
import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
})
export class AccountComponent implements OnInit {
  user:UserModel;
  email:string='';
  constructor(private authService:AuthService) {

    this.user = this.authService.getcurrentUserValue();
  }

  ngOnInit(): void {}
}
