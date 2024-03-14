import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerApprovalListingComponent } from './buyer-approval-listing.component';

describe('BuyerApprovalListingComponent', () => {
  let component: BuyerApprovalListingComponent;
  let fixture: ComponentFixture<BuyerApprovalListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerApprovalListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyerApprovalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
