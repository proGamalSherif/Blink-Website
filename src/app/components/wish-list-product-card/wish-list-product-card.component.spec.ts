import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishListProductCardComponent } from './wish-list-product-card.component';

describe('WishListProductCardComponent', () => {
  let component: WishListProductCardComponent;
  let fixture: ComponentFixture<WishListProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishListProductCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishListProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
