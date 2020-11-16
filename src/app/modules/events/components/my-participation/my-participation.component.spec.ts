import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyParticipationComponent } from './my-participation.component';

describe('MyParticipationComponent', () => {
  let component: MyParticipationComponent;
  let fixture: ComponentFixture<MyParticipationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyParticipationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
