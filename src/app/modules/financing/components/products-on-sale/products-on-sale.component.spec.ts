import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsOnSaleComponent } from './products-on-sale.component';

describe('ProductsOnSaleComponent', () => {
  let component: ProductsOnSaleComponent;
  let fixture: ComponentFixture<ProductsOnSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsOnSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsOnSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
