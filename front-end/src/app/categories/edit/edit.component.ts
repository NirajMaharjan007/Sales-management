import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoriesService } from '../../services/categories.service';
@Component({
  selector: 'categories-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class CategoryEditComponent {
  categoryForm: FormGroup;
  id: string | null = null;
  successMessage: string | null = ' ';
  errorMessage: string | null = ' ';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private categoriesService: CategoriesService
  ) {
    this.categoryForm = this.fb.group({
      name: [, [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // 'id' is the name of the parameter
    });
  }

  getName() {}

  onSubmit() {
    console.log('onSubmit ' + this.categoryForm.valid);
    if (this.categoryForm.valid) {
      this.categoriesService.editCategory(this.categoryForm.value).subscribe({
        next: (data: any) => {
          this.successMessage = 'Category edited successfully!';
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
