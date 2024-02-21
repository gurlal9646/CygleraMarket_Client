import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalListingComponent } from './approval-listing.component';

describe('ApprovalListingComponent', () => {
  let component: ApprovalListingComponent;
  let fixture: ComponentFixture<ApprovalListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ApprovalListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
