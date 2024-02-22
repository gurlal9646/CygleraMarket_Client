import { Component,OnInit } from '@angular/core';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ThemeModeService } from 'src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CygleraService } from 'src/app/services/cygleraservice.service';
@Component({
  selector: 'app-service-listing',
  templateUrl: './service-listing.component.html',
  styleUrl: './service-listing.component.scss'
})
export class ServiceListingComponent implements OnInit {
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
  serviceList: any = [];
  private unsubscribe: Subscription[] = [];
  static that:any;

  constructor(
    private cygleraService: CygleraService,
    private modeService: ThemeModeService,
    private router: Router
  ) {
    ServiceListingComponent.that = this;

  }

  ngOnInit(): void {
    const subscr = this.modeService.mode.asObservable().subscribe((mode) => {
      const serviceListElement = document.getElementById('serviceList');

      //check if element exists
      if (serviceListElement) {
        //change the class based on the node
        serviceListElement.className =
          mode === 'dark' ? 'ag-theme-quartz-dark' : 'ag-theme-quartz';
      }
    });
    this.unsubscribe.push(subscr);

    this.InitializeGrid();
  }

  async InitializeGrid() {
    await this.loadGridSettings();
    await this.GridFieldsLoad();
    await this.GetServices();
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
    let Name = 'Name';
    let Price = 'Price';
    let Description = 'Description';
    let CreatedDate = 'CreatedDate';
    let Action = 'Action';
    const columnDefs = [
      {
        headerName: Name,
        field: 'name',
        headerTooltip: Name,
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'clippingText'],
        width: 230,
        minWidth: 120,
      },
      {
        headerName: Price,
        field: 'price',
        tooltipField: 'price',
        headerTooltip: Price,
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'clippingText'],
        width: 210,
        minWidth: 120,
        flex: 1,
      },
      {
        headerName: Description,
        field: 'description',
        tooltipField: 'description',
        headerTooltip: Description,
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'clippingText'],
        width: 210,
        minWidth: 120,
        flex: 1, 
      },
      {
        headerName: CreatedDate,
        field: 'createdAt',
        headerTooltip: CreatedDate,
        cellRenderer: this.DateCellrender,
        autoHeight: true,
        cellClass: ['cursor-pointer', 'agTooltip', 'clippingText'],
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

  editCellRender(param: any) {
    const editButton = `
    <button class="btn btn-icon btn-active-light-primary w-30px h-30px me-3" data-action="edit" data-id="${param.data._id}">
      <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
    </button>`;

    const deleteButton = `
    <button class="btn btn-icon btn-active-light-primary w-30px h-30px" data-action="delete" data-id="${param.data._id}">
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
      console.log('Edit button clicked for id:', param.data._id);
      ServiceListingComponent.that.router.navigate([`/services/editservice/${param.data._id}`]);
    });

    deleteBtn.addEventListener('click', () => {
      console.log('Delete button clicked for id:', param.data._id);

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
          const response = await  ServiceListingComponent.that.cygleraService.deleteService(param.data._id);
          if (response.code == 1) {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: response.message,
              showConfirmButton:false,
              timer:5000
            });
            ServiceListingComponent.that.ngOnInit();
          }
        }
      });
    });

    // Return the HTML content with attached event listeners
    return div;
  }

  DateCellrender(param: { data: { createdAt: null } }) {
    if (param.data.createdAt == null) {
      return 'Never Authenticated';
    }
    return moment(param.data.createdAt).format('MM/DD/YYYY hh:mm:ss A');
  }

  async GetServices() {
    const response = await this.cygleraService.getServices();
    if (response.code == 1) {
      this.serviceList = response.data;
      if (this.gridApiMembers) {
        this.gridApiMembers.setGridOption('rowData', this.serviceList);
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
      this.gridApiMembers.setGridOption('rowData', this.serviceList);
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
