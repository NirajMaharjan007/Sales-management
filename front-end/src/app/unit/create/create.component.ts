import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UnitsService } from '../../services/units.service';

@Component({
  selector: 'unit-create',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class UnitCreateComponent {
  unitForm: FormGroup;
  successMessage: string | null = ' ';
  errorMessage: string | null = ' ';
  constructor(private fb: FormBuilder, private unitsService: UnitsService) {
    this.unitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    console.log('onSubmit ' + this.unitForm.valid);
    if (this.unitForm.valid) {
      this.unitsService.createUnit(this.unitForm.value).subscribe({
        next: (data: any) => {
          this.successMessage = 'Unit created successfully!';
          this.errorMessage = ' '; // Clear any previous error message
          this.unitForm.reset(); // Reset the form
          alert(this.successMessage);
        },
        error: (error) => {
          this.errorMessage = 'An error occurred. Please try again.';
          this.successMessage = ' '; // Clear any previous success message
          alert(this.errorMessage);
        },
      });
    } else {
      alert('Invalid input');
    }
  }
}
