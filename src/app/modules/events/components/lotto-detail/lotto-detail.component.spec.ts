import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottoDetailComponent } from './lotto-detail.component';

describe('LottoDetailComponent', () => {
  let component: LottoDetailComponent;
  let fixture: ComponentFixture<LottoDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottoDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottoDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
