import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRankingComponent } from './daily-ranking.component';

describe('DailyRankingComponent', () => {
  let component: DailyRankingComponent;
  let fixture: ComponentFixture<DailyRankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyRankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
