import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaxService } from '../../services/tax.service';

@Component({
  selector: 'tax-create',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class TaxCreateComponent {
  taxForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  constructor(private fb: FormBuilder, private taxService: TaxService) {
    this.taxForm = this.fb.group({
      id: ['id', [Validators.required]], // Add any additional validators if necessary
    });
  }

  onSubmit() {
    console.log('onSubmit ' + this.taxForm.valid);
    if (this.taxForm.valid) {
      this.taxService.createTax(this.taxForm.value).subscribe({
        next: (data: any) => {
          this.successMessage = 'Tax created successfully!';
          this.errorMessage = null; // Clear any previous error message
          this.taxForm.reset(); // Reset the form
        },
        error: (error) => {
          this.errorMessage = error.error.message;
          this.successMessage = null; // Clear any previous success message
        },
      });
      alert(this.successMessage + ' ' + this.errorMessage);
    } else {
      alert('Invalid input');
    }
  }
}
