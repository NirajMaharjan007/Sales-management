import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppilerManageComponent } from './manage.component';

describe('SuppilerManageComponent', () => {
  let component: SuppilerManageComponent;
  let fixture: ComponentFixture<SuppilerManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppilerManageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuppilerManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
