import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppilerEditComponent } from './edit.component';

describe('SuppilerEditComponent', () => {
  let component: SuppilerEditComponent;
  let fixture: ComponentFixture<SuppilerEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppilerEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuppilerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
