import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NegotiationConversationComponent } from './negotiation-conversation.component';

describe('NegotiationConversationComponent', () => {
  let component: NegotiationConversationComponent;
  let fixture: ComponentFixture<NegotiationConversationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NegotiationConversationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NegotiationConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
