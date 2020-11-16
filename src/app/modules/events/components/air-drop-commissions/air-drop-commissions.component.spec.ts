import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirDropCommissionsComponent } from './air-drop-commissions.component';

describe('AirDropCommissionsComponent', () => {
  let component: AirDropCommissionsComponent;
  let fixture: ComponentFixture<AirDropCommissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirDropCommissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirDropCommissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
