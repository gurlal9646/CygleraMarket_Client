import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { RequestForApprovalService } from 'src/app/services/rfa.service';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-contract-listing',
  templateUrl: './contract-listing.component.html',
  styleUrl: './contract-listing.component.scss',
})
export class ContractListingComponent implements OnInit {
  columnDefsUsers: any;
  public defaultColDef: { resizable: boolean; sortable: boolean };
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
 contractList: any = [];
  private unsubscribe: Subscription[] = [];
  static that: any;
  isCollapsed1 = false;
  price: number = 0;
  requestId: string = '';
  isLoading = false;
  @ViewChild('approveModal')
  approveModal: TemplateRef<any>;
  @ViewChild('negotiationModal')
  negotiationModal: TemplateRef<any>;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  conversationList: any = [];
  newMessage: string = '';
  user: UserModel;
  isDrawer:false;
  constructor(
    private contractService: ContractService,
    private modeService: ThemeModeService,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    private modalService: NgbModal,
    private rfaService: RequestForApprovalService,
    private authService: AuthService
  ) {
    this.user = this.authService.getcurrentUserValue();
    ContractListingComponent.that = this;
  }

  ngOnInit(): void {
    const subscr = this.modeService.mode.asObservable().subscribe((mode) => {
      const contractListElement = document.getElementById('contractList');

      // Check if the element exists
      if (contractListElement) {
        // Change the class based on the mode
        contractListElement.className =
          mode === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';
      }
    });
    this.unsubscribe.push(subscr);

    this.InitializeGrid();
  }

  async InitializeGrid() {
    await this.loadGridSettings();
    await this.GridFieldsLoad();
    await this.GetContracts();
  }

  async loadGridSettings() {
    this.columnDefsUsers = [];
    this.defaultColDef = { resizable: true, sortable: true };
    this.rowBuffer = 0;
    this.rowSelection = 'multiple';
    this.rowModelType = 'infinite';
    this.paginationPageSize = 20;
    return '';
  }

  async GridFieldsLoad() {
    let Type = 'Type';
    let Price = 'Price';
    let Status = 'Status';
    let CreatedDate = 'CreatedDate';
    let Action = 'Action';
    const columnDefs = [
      {
        headerName: Type,
        field: 'type',
        headerTooltip: Type,
        cellRenderer: this.TypeCellrender,
        cellRendererParams: (params: any) => ({
          type: params.data.type,
        }),
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'clippingtext'],
        width: 230,
        minWidth: 120,
      },
      {
        headerName: Price,
        field: 'price',
        tooltipField: 'Price',
        headerTooltip: Price,
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'clippingtext'],
        width: 210,
        minWidth: 120,
        flex: 1,
        valueFormatter: (params: any) => {
          return this.currencyPipe.transform(
            params.data.price,
            'CAD',
            'symbol',
            '1.2-2'
          );
        },
      },
      {
        headerName: Status,
        field: 'status',
        tooltipField: 'Status',
        headerTooltip: Status,
        cellRenderer: this.statusCellRenderer,
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'clippingtext'],
        width: 210,
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: CreatedDate,
        field: 'createdAt',
        headerTooltip: CreatedDate,
        cellRenderer: this.DateCellrender,
        cellRendererParams: (params: any) => ({
          date: params.data.createdAt,
        }),
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'clippingtext'],
        width: 120,
        minWidth: 120,
        flex: 1,
      }
    ];
    this.overlayLoadingTemplate =
      '<div id="spinnerOverlay" class="pageloader"><div class="boxaligncenter"><div class="lds-roller" > <div></div><div></div > <div></div><div></div > <div></div><div></div > <div></div><div></div > </div></div></div>';
    this.columnDefsUsers = columnDefs;
    return '';
  }

  DateCellrender(param: any) {
    if (param.date == null) {
      return 'Never Authenticated';
    }
    return moment(param.date).format('MM/DD/YYYY');
  }

  // Inside your Angular component class
  statusCellRenderer(params: any) {
    let badgeColor = '';

    switch (params.data.status) {
      case 'Approved by seller':
        badgeColor = 'badge-warning';
        break;
      case 'Approved by buyer':
        badgeColor = 'badge-success';
        break;
      case 'Payment Pending':
        badgeColor = 'badge-danger';
        break;
        case 'Payment Completed':
          badgeColor = 'badge-success';
          break;
      default:
        badgeColor = 'badge-secondary';
    }

    return `<span class="badge ${badgeColor}">${params.data.status}</span>`;
  }

  TypeCellrender(param: any) {
    if (param.type == 1) {
      return 'Product';
    } else if (param.type == 2) {
      return 'Service';
    } else if (param.type == 3) {
      return 'Program';
    }
    return 'Unknown';
  }



  async GetContracts() {
    const response = await this.contractService.getContracts();
    if (response.code == 1) {
      this.contractList = response.data;
      if (this.gridApiMembers) {
        this.gridApiMembers.setGridOption('rowData', this.contractList);
      }
    }
  }


  onGridReadyMember(params: { api: any; columnApi: any }) {
    this.gridParamsMembers = params;
    this.gridApiMembers = params.api;
    this.gridColumnApiMembers = params.columnApi;
    this.gridApiMembers.setGridOption('rowData', []);
    this.gridApiMembers.showLoadingOverlay();
  }

  onSelectionChanged(event: any) {}

  quicksearch() {
    if (this.gridApiMembers) {
      this.gridApiMembers.setGridOption('rowData', this.contractList);
    }
    this.gridApiMembers.setQuickFilter(this.searchvalue);
    if (
      this.gridApiMembers &&
      this.gridApiMembers.getDisplayedRowCount() == 0
    ) {
      this.gridApiMembers.setGridOption('rowData', []);
    }
  }


}


