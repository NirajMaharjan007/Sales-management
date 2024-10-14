import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitManageComponent } from './manage.component';

describe('UnitManageComponent', () => {
  let component: UnitManageComponent;
  let fixture: ComponentFixture<UnitManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnitManageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
