import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealtOrdersComponent } from './dealt-orders.component';

describe('DealtOrdersComponent', () => {
  let component: DealtOrdersComponent;
  let fixture: ComponentFixture<DealtOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealtOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealtOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
