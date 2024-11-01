import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SuppilersService } from '../../services/suppliers.service';

@Component({
  selector: 'supplier-create',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class SupplierCreateComponent {
  supplierForm: FormGroup;
  successMessage: string | null = ' ';
  errorMessage: string | null = ' ';
  constructor(
    private fb: FormBuilder,
    private suppilersService: SuppilersService
  ) {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.minLength(10)]],
      previous_balance: ['', [Validators.required]],
      details: ['', [Validators.minLength(1)]],
    });
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      this.suppilersService.createSupplier(this.supplierForm.value).subscribe({
        next: (data: any) => {
          this.successMessage = 'Supplier created successfully!';
          this.errorMessage = ' '; // Clear any previous error message
          this.supplierForm.reset(); // Reset the form
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
