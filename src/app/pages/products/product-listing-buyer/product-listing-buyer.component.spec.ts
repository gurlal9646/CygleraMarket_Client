import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListingBuyerComponent } from './product-listing-buyer.component';

describe('ProductListingBuyerComponent', () => {
  let component: ProductListingBuyerComponent;
  let fixture: ComponentFixture<ProductListingBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListingBuyerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductListingBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
