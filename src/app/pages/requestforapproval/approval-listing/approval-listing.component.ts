import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RequestForApprovalService } from 'src/app/services/rfa.service';

@Component({
  selector: 'app-approval-listing',
  templateUrl: './approval-listing.component.html',
  styleUrl: './approval-listing.component.scss'
})

export class ApprovalListingComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

}
 