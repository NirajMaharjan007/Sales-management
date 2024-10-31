import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UnitsService } from '../../services/units.service';

@Component({
  selector: 'unit-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class UnitEditComponent {
  unitForm: FormGroup;
  id: string | null = null;
  name: string | null = null;
  successMessage: string | null = ' ';
  errorMessage: string | null = ' ';

  router: Router = inject(Router);

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private unitsService: UnitsService
  ) {
    this.unitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // 'id' is the name of the parameter
      this.fetchName();
    });
  }

  fetchName() {
    this.unitsService.getById(this.id).subscribe({
      next: (data: any) => {
        this.name = data.name;
      },
      error: (error) => {
        console.error('Error getting unit', error);
      },
    });
  }

  onSubmit() {
    console.log('onSubmit ' + this.unitForm.valid);
    if (this.unitForm.valid) {
      this.unitsService.editUnit(this.id, this.unitForm.value).subscribe({
        next: (data: any) => {
          this.successMessage = 'Unit edited successfully!';
          this.errorMessage = ' '; // Clear any previous error message
          this.unitForm.reset(); // Reset the form
          alert(this.successMessage);
          this.router.navigate(['/units/manage']);
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
