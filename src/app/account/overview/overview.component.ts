import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  companyName: string;
  category: string;
  status: string;
  companySize: string;
  businessNumber: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdAt:string;
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  user:UserInfo;
  constructor(private loginService:LoginService) {}

  ngOnInit(): void {
    this.getUserDetails();
  }

  async getUserDetails(){
    const response = await this.loginService.getUserDetails();
    if(response.code == 1){
      this.user = response.data;
    }

  }



  
}
