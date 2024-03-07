import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramListingBuyerComponent } from './program-listing-buyer.component';

describe('ProgramListingBuyerComponent', () => {
  let component: ProgramListingBuyerComponent;
  let fixture: ComponentFixture<ProgramListingBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramListingBuyerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramListingBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
