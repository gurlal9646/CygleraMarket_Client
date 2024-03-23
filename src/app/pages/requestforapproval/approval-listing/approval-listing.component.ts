import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { Router } from '@angular/router';
import { ApprovalService } from 'src/app/services/approval.service';
import { CurrencyPipe } from '@angular/common';
import { NgForm } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { RequestForApprovalService } from 'src/app/services/rfa.service';
import { UserModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-approval-listing',
  templateUrl: './approval-listing.component.html',
  styleUrl: './approval-listing.component.scss',
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
  requestList: any = [];
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
    private approvalService: ApprovalService,
    private modeService: ThemeModeService,
    private router: Router,
    private currencyPipe: CurrencyPipe,
    private modalService: NgbModal,
    private rfaService: RequestForApprovalService,
    private authService: AuthService
  ) {
    this.user = this.authService.getcurrentUserValue();
    ApprovalListingComponent.that = this;
  }

  ngOnInit(): void {
    const subscr = this.modeService.mode.asObservable().subscribe((mode) => {
      const requestListElement = document.getElementById('requestList');

      // Check if the element exists
      if (requestListElement) {
        // Change the class based on the mode
        requestListElement.className =
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
      },
      {
        headerName: Action,
        field: 'Id',
        cellRenderer: this.editCellRender,
        headerTooltip: Action,
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'contextMenu'],
        width: 150,
        minWidth: 120,
      },
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

  editCellRender(param: any) {
    const approveButton = `
      <a class="btn btn-icon btn-active-light-primary w-30px h-30px me-3" data-action="approve" data-id="${param.data._id}" title="Approve request">
        <i class="ki-outline ki-shield-tick fs-3"><span class="path1"></span><span class="path2"></span></i>
        
      </a>`;

    const rejectButton = `
    <a class="btn btn-icon btn-active-light-primary w-30px h-30px me-3" data-action="reject" data-id="${param.data._id}" title="Reject request">
      <i class="ki-outline ki-shield-cross fs-3"><span class="path1"></span><span class="path2"></span></i>
      
    </a>`;

    const viewButton = `
    <a class="btn btn-icon btn-active-light-primary w-30px h-30px me-3" data-action="view" data-id="${param.data._id}" title="Review negotiation">
      <i class="ki-outline ki-eye fs-3"><span class="path1"></span><span class="path2"></span></i>
      
    </a>`;

    let buttons: any = '';
    if (param.data.status === 'approved') {
      buttons = [rejectButton, viewButton].join('');
    } else if (param.data.status === 'rejected') {
      buttons = [approveButton, viewButton].join('');
    } else if (param.data.status === 'pending') {
      buttons = [approveButton, rejectButton, viewButton].join('');
    }

    // Create a div element to wrap buttons
    const div = document.createElement('div');
    div.innerHTML = buttons;

    // Add event listeners to the buttons
    const approveBtn: any = div.querySelector('[data-action="approve"]');
    const rejectBtn: any = div.querySelector('[data-action="reject"]');
    const viewBtn: any = div.querySelector('[data-action="view"]');
    if (approveBtn) {
      approveBtn.addEventListener('click', () => {
        // Handle edit button click
        ApprovalListingComponent.that.price = param.data.price;
        ApprovalListingComponent.that.requestId = param.data.requestId;
        ApprovalListingComponent.that.modalService.open(
          ApprovalListingComponent.that.approveModal,
          ApprovalListingComponent.that.modalConfig
        );
      });
    }
    if (rejectBtn) {
      ApprovalListingComponent.that.requestId = param.data.requestId;
      rejectBtn.addEventListener('click', () => {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to reject this purchase request?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, reject it!',
        }).then(async (result) => {
          if (result.isConfirmed) {
            const request = {
              status: 'rejected',
            };

            await ApprovalListingComponent.that.updateRequestStatus(request);
          }
        });
      });
    }
    if (viewBtn) {
      viewBtn.addEventListener('click', () => {
        ApprovalListingComponent.that.modalService.open(
          ApprovalListingComponent.that.negotiationModal,
          ApprovalListingComponent.that.modalConfig
        );
      });
      ApprovalListingComponent.that.getConversation(param.data.requestId);
    }

    // Return the HTML content with attached event listeners
    return div;
  }

  async GetApprovals() {
    const response = await this.approvalService.getApprovals();
    if (response.code == 1) {
      this.requestList = response.data;
      if (this.gridApiMembers) {
        this.gridApiMembers.setGridOption('rowData', this.requestList);
      }
    }
  }

  calculateDays(sDate: any, eDate: any) {
    const startDate = new Date(sDate);
    const endDate = new Date(eDate);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference;
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
      this.gridApiMembers.setGridOption('rowData', this.requestList);
    }
    this.gridApiMembers.setQuickFilter(this.searchvalue);
    if (
      this.gridApiMembers &&
      this.gridApiMembers.getDisplayedRowCount() == 0
    ) {
      this.gridApiMembers.setGridOption('rowData', []);
    }
  }

  async onSubmit(event: Event, myForm: NgForm) {
    if (myForm && myForm.invalid) {
      return;
    }
    const request = {
      status: 'approved',
      price: myForm.value['price'],
    };

    await this.updateRequestStatus(request);
  }

  async updateRequestStatus(request: any) {
    const response = await this.rfaService.updateRequestStatus(
      this.requestId,
      request
    );
    if (response.code == 1) {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: response.message,
        showConfirmButton: false,
        timer: 5000,
      });
      this.modalService.dismissAll();
      this.ngOnInit();
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: response.message,
        timer: 5000,
      });
    }
  }

  async sendMessage() {
    const request = {
      requestId: this.requestId,
      message: this.newMessage,
      sellerId: this.user.uniqueId,
    };
    const response = await this.rfaService.addConversation(request);
    if (response.code == 1) {
      this.newMessage = '';
      await this.getConversation(this.requestId);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: response.message,
        timer: 5000,
      });
    }
  }

  async getConversation(requestId: any) {
    const response = await this.rfaService.getConversation(requestId);
    if (response.code == 1) {
      this.conversationList = response.data;
      for(let message of this.conversationList){
        message.time = moment(message.createdAt).fromNow();
      }
    }
    else{
      this.conversationList = [];
    }
  }

  getMessageCssClass(message: any): string {
    return `p-5 rounded text-gray-900 fw-bold mw-lg-400px bg-light-${
      message.sellerId !== '' ? 'info' : 'primary'
    } text-${message.sellerId !== '' ? 'start' : 'end'}`;
  }
}
