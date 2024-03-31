import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerContractListingComponent } from './buyer-contract-listing.component';

describe('BuyerContractListingComponent', () => {
  let component: BuyerContractListingComponent;
  let fixture: ComponentFixture<BuyerContractListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyerContractListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BuyerContractListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
