import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordForgetByPhoneComponent } from './password-forget-by-phone.component';

describe('PasswordForgetByPhoneComponent', () => {
  let component: PasswordForgetByPhoneComponent;
  let fixture: ComponentFixture<PasswordForgetByPhoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordForgetByPhoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordForgetByPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
