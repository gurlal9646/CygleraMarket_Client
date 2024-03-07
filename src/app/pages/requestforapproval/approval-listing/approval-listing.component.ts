import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApprovalService } from 'src/app/services/approval.service';
import { EntityType } from 'src/app/models/Enums';

@Component({
  selector: 'app-approval-listing',
  templateUrl: './approval-listing.component.html',
  styleUrl: './approval-listing.component.scss'
})
export class ApprovalListingComponent implements OnInit {
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
  programList: any = [];
  private unsubscribe: Subscription[] = [];
  static that:any;

  constructor(
    private approvalService: ApprovalService,
    private modeService: ThemeModeService,
    private router:Router
  ) {
    ApprovalListingComponent.that = this;

  }

  ngOnInit(): void {
    const subscr = this.modeService.mode.asObservable().subscribe((mode) => {
      const productListElement = document.getElementById('productList');

      // Check if the element exists
      if (productListElement) {
        // Change the class based on the mode
        productListElement.className =
          mode === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';
      }
    });
    this.unsubscribe.push(subscr);

    this.InitializeGrid();
  }

  async InitializeGrid() {
    await this.loadGridSettings();
    await this.GridFieldsLoad();
    await this.GetApprovals();
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
        cellRendererParams: (params:any) => ({
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
        cellRendererParams: (params:any) => ({
          date: params.data.createdAt,
        }),
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'clippingtext'],
        width: 150,
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: Action,
        field: 'Id',
        cellRenderer: this.editCellRender,
        headerTooltip: Action,
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'contextMenu'],
        width: 120,
        minWidth: 120,
      },
    ];
    this.overlayLoadingTemplate =
      '<div id="spinnerOverlay" class="pageloader"><div class="boxaligncenter"><div class="lds-roller" > <div></div><div></div > <div></div><div></div > <div></div><div></div > <div></div><div></div > </div></div></div>';
    this.columnDefsUsers = columnDefs;
    return '';
  }

  DateCellrender(param: any ) {
    if (param.date == null) {
      return 'Never Authenticated';
    }
    return moment(param.date).format('MM/DD/YYYY');
  }

  // Inside your Angular component class
statusCellRenderer(params: any) {
  let badgeText = '';
  let badgeColor = '';

  switch (params.data.status) {
    case 'pending':
      badgeText = 'Pending';
      badgeColor = 'badge-warning';
      break;
    case 'approved':
      badgeText = 'Approved';
      badgeColor = 'badge-success';
      break;
    case 'rejected':
      badgeText = 'Rejected';
      badgeColor = 'badge-danger';
      break;
    default:
      badgeText = 'Unknown';
      badgeColor = 'badge-secondary';
  }

  return `<span class="badge ${badgeColor}">${badgeText}</span>`;
}


  TypeCellrender(param: any ) {
    if (param.type == 1) {
      return 'Product'
    }
   else if (param.type == 2) {
      return 'Service';
    }
    else if (param.type == 3) {
      return 'Program'
    }
    return 'Unknown';
  }

  editCellRender(param: any) {
    const editButton = `
    <button class="btn btn-icon btn-active-light-primary w-30px h-30px me-3" data-action="edit" data-id="${param.data.programId}">
      <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
    </button>`;

    const deleteButton = `
    <button class="btn btn-icon btn-active-light-primary w-30px h-30px" data-action="delete" data-id="${param.data.programId}">
      <i class="ki-duotone ki-trash fs-3">
        <span class="path1"></span><span class="path2"></span>
        <span class="path3"></span><span class="path4"></span><span class="path5"></span>
      </i>
    </button>`;

    const buttons = [editButton, deleteButton].join('');

    // Create a div element to wrap buttons
    const div = document.createElement('div');
    div.innerHTML = buttons;

    // Add event listeners to the buttons
    const editBtn: any = div.querySelector('[data-action="edit"]');
    const deleteBtn: any = div.querySelector('[data-action="delete"]');

    editBtn.addEventListener('click', () => {
      // Handle edit button click
      ApprovalListingComponent.that.router.navigate([`/programs/editprogram/${param.data.programId}`]);
    });

    deleteBtn.addEventListener('click', () => {

      Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this record!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await ApprovalListingComponent.that.productService.deleteProgram(param.data.programId);
          if (response.code == 1) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: response.message,
              showConfirmButton:false,
              timer:5000
            });
            ApprovalListingComponent.that.ngOnInit();
          }
        }
      });
    });

    // Return the HTML content with attached event listeners
    return div;
  }



  async GetApprovals() {
    const response = await this.approvalService.getApprovals();
    if (response.code == 1) {
      this.programList = response.data;
      if (this.gridApiMembers) {
        this.gridApiMembers.setGridOption('rowData', this.programList);
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
      this.gridApiMembers.setGridOption('rowData', this.programList);
    }
    this.gridApiMembers.setQuickFilter(this.searchvalue);
    if (
      this.gridApiMembers &&
      this.gridApiMembers.getDisplayedRowCount() == 0
    ) {
      this.gridApiMembers.setGridOption('rowData', []);
    }
    console.log(this.gridApiMembers.getDisplayedRowCount());
  }
}
