import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../services/categories.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'categories-create',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CategoryCreateComponent {
  categoryForm: FormGroup;
  successMessage: string | null = ' ';
  errorMessage: string | null = ' ';
  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {
    this.categoryForm = this.fb.group({
      name: ['name', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    console.log('onSubmit ' + this.categoryForm.valid);
    if (this.categoryForm.valid) {
      this.categoriesService.createCategory(this.categoryForm.value).subscribe({
        next: (data: any) => {
          this.successMessage = 'Category created successfully!';
          this.errorMessage = ' '; // Clear any previous error message
          this.categoryForm.reset(); // Reset the form
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
