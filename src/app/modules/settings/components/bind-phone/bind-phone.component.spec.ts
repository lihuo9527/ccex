import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BindPhoneComponent } from './bind-phone.component';

describe('BindPhoneComponent', () => {
  let component: BindPhoneComponent;
  let fixture: ComponentFixture<BindPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BindPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BindPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
