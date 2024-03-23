import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lists-widget26',
  templateUrl: './lists-widget26.component.html',
  styleUrls: ['./lists-widget26.component.scss'],
})
export class ListsWidget26Component implements OnInit {
  rows: Array<{ description: string }>;

  constructor() {}

  ngOnInit(): void {
    this.rows = [
      { description: 'Cyglera Health Marketplace Assistance' },
      { description: 'Cyglera Health Marketplace Social Media Following' },
      { description: 'Cyglera Health Marketplace Advertising Cost-Per-Click (CPC)' }
    ];
  }
}
