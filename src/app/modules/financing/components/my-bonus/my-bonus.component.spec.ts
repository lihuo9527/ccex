import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBonusComponent } from './my-bonus.component';

describe('MyCommissionComponent', () => {
  let component: MyBonusComponent;
  let fixture: ComponentFixture<MyBonusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyBonusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyBonusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
