import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

  user:UserModel;
  constructor(private authService:AuthService) { 
    this.user = this.authService.getcurrentUserValue();
  }

  ngOnInit(): void {
  }

}
