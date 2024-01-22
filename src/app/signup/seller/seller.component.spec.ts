import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerComponent } from './seller.component';

describe('SellerComponent', () => {
  let component: SellerComponent; // declare variable component of type SellerComponent
  let fixture: ComponentFixture<SellerComponent>; //declare variable fixture of type ComponentFixture<SellerComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerComponent] //imports the SellerComponent module
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SellerComponent);
    component = fixture.componentInstance; //retrieves componentInstance from fixture
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
