import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAuthentictionInvalidationComponent } from './google-authentiction-invalidation.component';

describe('GoogleAuthentictionInvalidationComponent', () => {
  let component: GoogleAuthentictionInvalidationComponent;
  let fixture: ComponentFixture<GoogleAuthentictionInvalidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleAuthentictionInvalidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleAuthentictionInvalidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
