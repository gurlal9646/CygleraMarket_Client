import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tables-widget5',
  templateUrl: './tables-widget5.component.html',
})
export class TablesWidget5Component implements OnInit {
  @Input() productList:any = [];
  constructor() {}

  ngOnInit(): void {
    console.log(this.productList);
  }
}
