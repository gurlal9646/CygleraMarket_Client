import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataTablesResponse, IUserModel, UserService } from 'src/app/_fake/services/user-service';
import { SweetAlertOptions } from 'sweetalert2';
import moment from 'moment';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, AfterViewInit {

 dtOptions: DataTables.Settings = {};


  constructor(private _productService: ProductService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.dtOptions = {
      serverSide: true,     // Set the flag 
      ajax: async (dataTablesParameters: any, callback) => {
        try {
          const resp = await this._productService.getProducts(dataTablesParameters);
    
          callback({
            recordsTotal: resp.data.length,
            recordsFiltered: resp.data.length,
            data: resp.data
          });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      },
      columns: [{
        title: 'ID',
        data: 'productId'
      }, {
        title: 'Name',
        data: 'name'
      }, {
        title: 'Price',
        data: 'price'
      }]
    };
    
  }

  delete(id: number) {

  }

  edit(id: number) {

  }

  create() {
  }

}