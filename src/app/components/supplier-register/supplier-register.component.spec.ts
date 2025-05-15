import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierRegisterComponent } from './supplier-register.component';

describe('SupplierRegisterComponent', () => {
  let component: SupplierRegisterComponent;
  let fixture: ComponentFixture<SupplierRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
