import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PacientViewComponent } from './pacient-view.component';

describe('PacientViewComponent', () => {
  let component: PacientViewComponent;
  let fixture: ComponentFixture<PacientViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PacientViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PacientViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
