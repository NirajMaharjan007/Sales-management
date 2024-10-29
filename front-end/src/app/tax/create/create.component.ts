import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaxService } from '../../services/tax.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'tax-create',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class TaxCreateComponent {
  taxForm: FormGroup;
  successMessage: string | null = ' ';
  errorMessage: string | null = ' ';
  constructor(private fb: FormBuilder, private taxService: TaxService) {
    this.taxForm = this.fb.group({
      id: ['id', [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    console.log('onSubmit ' + this.taxForm.valid);
    if (this.taxForm.valid) {
      this.taxService.createTax(this.taxForm.value).subscribe({
        next: (data: any) => {
          this.successMessage = 'Tax created successfully!';
          this.errorMessage = ' '; // Clear any previous error message
          this.taxForm.reset(); // Reset the form
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
