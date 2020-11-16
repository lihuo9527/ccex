import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleValidateComponent } from './google-validate.component';

describe('GoogleValidateComponent', () => {
  let component: GoogleValidateComponent;
  let fixture: ComponentFixture<GoogleValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
