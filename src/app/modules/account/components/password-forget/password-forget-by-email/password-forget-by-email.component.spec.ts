import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordForgetByEmailComponent } from './password-forget-by-email.component';

describe('PasswordForgetByEmailComponent', () => {
  let component: PasswordForgetByEmailComponent;
  let fixture: ComponentFixture<PasswordForgetByEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordForgetByEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordForgetByEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
