import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppilerCreateComponent } from './create.component';

describe('SuppilerCreateComponent', () => {
  let component: SuppilerCreateComponent;
  let fixture: ComponentFixture<SuppilerCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuppilerCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SuppilerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
