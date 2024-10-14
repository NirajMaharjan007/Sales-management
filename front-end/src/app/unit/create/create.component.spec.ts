import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCreateComponent } from './create.component';

describe('UnitCreateComponent', () => {
  let component: UnitCreateComponent;
  let fixture: ComponentFixture<UnitCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
