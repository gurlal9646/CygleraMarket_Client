import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ProfileDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileDetailsComponent
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ProfileModule { }
