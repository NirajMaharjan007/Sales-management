import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SuppilersService } from '../../services/suppliers.service';

@Component({
  selector: 'supplier-edit',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css',
})
export class SupplierEditComponent {
  supplierForm: FormGroup;
  id: string | null = null;
  successMessage: string | null = ' ';
  errorMessage: string | null = ' ';

  //data
  name: string | null = null;
  address: string | null = null;
  mobile: string | null = null;
  previous_balance: string | null = null;
  details: string | null = null;

  router: Router = inject(Router);

  constructor(
    private route: ActivatedRoute,
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

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get('id'); // 'id' is the name of the parameter
      this.fetch();
    });
  }

  fetch() {
    this.suppilersService.getSupplierById(this.id).subscribe({
      next: (data: any) => {
        this.name = data.name;
        this.address = data.address;
        this.mobile = data.mobile;
        this.previous_balance = data.previous_balance;
        this.details = data.details;
      },
      error: (error) => {
        console.error('Error getting unit', error);
      },
    });
  }

  onSubmit() {
    if (this.supplierForm.valid) {
      this.suppilersService
        .editSupplier(this.id, this.supplierForm.value)
        .subscribe({
          next: (data: any) => {
            this.successMessage = 'Supplier Updated successfully!';
            this.errorMessage = ' '; // Clear any previous error message
            this.supplierForm.reset(); // Reset the form
            alert(this.successMessage);
            this.router.navigate(['/suppliers/manage']);
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
