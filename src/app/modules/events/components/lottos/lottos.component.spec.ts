import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LottosComponent } from './lottos.component';

describe('LottosComponent', () => {
  let component: LottosComponent;
  let fixture: ComponentFixture<LottosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LottosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LottosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
