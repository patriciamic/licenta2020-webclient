import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConversationComponent } from './create-conversation.component';

describe('CreateConversationComponent', () => {
  let component: CreateConversationComponent;
  let fixture: ComponentFixture<CreateConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
