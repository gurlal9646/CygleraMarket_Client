import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceListingBuyerComponent } from './service-listing-buyer.component';

describe('ServiceListingBuyerComponent', () => {
  let component: ServiceListingBuyerComponent;
  let fixture: ComponentFixture<ServiceListingBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceListingBuyerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceListingBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
