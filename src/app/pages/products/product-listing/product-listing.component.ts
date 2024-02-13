import {  Component,  OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';

@Component({
  selector: 'app-products',
  templateUrl: './product-listing.component.html',
  styleUrl: './product-listing.component.scss'
})
export class ProductListingComponent implements OnInit {

  columnDefsUsers: any;
  public defaultColDef: { resizable: boolean; sortable: boolean; };
  public paginationPageSize: number;
  gridOptions: any;
  public gridApiMembers: any;
  public gridParamsMembers: any;
  public gridColumnApiMembers: any;
  public rowBuffer: number;
  public rowSelection: any;
  public rowModelType: string;
  overlayLoadingTemplate: string;
  searchvalue: any;
  productList: any =[];
  private unsubscribe: Subscription[] = [];


  constructor(private _productService: ProductService,private modeService: ThemeModeService) {

   }


  ngOnInit(): void {
    const subscr = this.modeService.mode.asObservable().subscribe((mode) => {
      const productListElement = document.getElementById('productList');

      // Check if the element exists
      if (productListElement) {
        // Change the class based on the mode
        productListElement.className = mode === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';
      }
    });
    this.unsubscribe.push(subscr);

    this.InitializeGrid();
  }

  async InitializeGrid() {

    await this.loadGridSettings();
    await this.GridFieldsLoad();
    await this.GetProducts();
  }

  async loadGridSettings() {
    this.columnDefsUsers = [];
    this.defaultColDef = { resizable: true, sortable: true };    
    this.rowBuffer = 0;
    this.rowSelection = 'multiple';
    this.rowModelType = 'infinite';
    this.paginationPageSize = 20;
    return "";
  }

  async GridFieldsLoad() {
    let Name = 'Name';
    let Price = 'Price';
    let CreatedDate = 'CreatedDate';
    let Action = 'Action';
    const columnDefs = [
     { headerName: Name, field: "name", headerTooltip: Name, autoHeight: true, cellClass: ["cursor-pointer", "agTooltip", "clippingtext"], "width": 230, "minWidth": 120 },
     { headerName: Price, field: "price", tooltipField: "Price", headerTooltip: Price, autoHeight: true, cellClass: ["cursor-pointer", "agTooltip", "clippingtext"], "width": 210, "minWidth": 120, flex: 2 },
     { headerName: CreatedDate, field: "createdAt", headerTooltip: CreatedDate, cellRenderer: this.DateCellrender, autoHeight: true, cellClass: ["cursor-pointer", "agTooltip", "clippingtext"], "width": 150, "minWidth": 120, flex: 1 },
     { headerName: Action, field: "Id", headerTooltip: Action, autoHeight: true, cellClass: ["cursor-pointer", "agTooltip", "contextMenu"], "width": 120, "minWidth": 120 },

    ];
    this.overlayLoadingTemplate = '<div id="spinnerOverlay" class="pageloader"><div class="boxaligncenter"><div class="lds-roller" > <div></div><div></div > <div></div><div></div > <div></div><div></div > <div></div><div></div > </div></div></div>';
    this.columnDefsUsers = columnDefs;
    return "";
  }

  DateCellrender(param: { data: { createdAt: null; }; }) {
    if (param.data.createdAt == null) {
      return 'Never Authenticated'
    }
    return moment(param.data.createdAt).format('MM/DD/YYYY hh:mm:ss A');
  }

 async GetProducts(){

    const response = await this._productService.getProducts();
    if(response.code == 1){
      this.productList= response.data;
      if (this.gridApiMembers) {
       this.gridApiMembers.setGridOption('rowData', this.productList);
      }
    }

  }

  onGridReadyMember(params: { api: any; columnApi: any; }) {
    this.gridParamsMembers = params;
    this.gridApiMembers = params.api;
    this.gridColumnApiMembers = params.columnApi;
    this.gridApiMembers.setGridOption('rowData',[]);
    this.gridApiMembers.showLoadingOverlay();
  }

  onSelectionChanged(event:any) {
  }

  quicksearch() {
    if (this.gridApiMembers) {
      this.gridApiMembers.setGridOption('rowData', this.productList);
    }
    this.gridApiMembers.setQuickFilter(this.searchvalue);
    if (this.gridApiMembers && this.gridApiMembers.getDisplayedRowCount() == 0) {
      this.gridApiMembers.setGridOption('rowData',[]);
    }
    console.log(this.gridApiMembers.getDisplayedRowCount())
  }

}