import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramListingComponent } from './program-listing.component';

describe('ProgramListingComponent', () => {
  let component: ProgramListingComponent;
  let fixture: ComponentFixture<ProgramListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgramListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
