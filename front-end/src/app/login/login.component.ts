import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  protected loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor() {}
  ngOnInit(): void {}

  // login() {}

  onSubmit() {
    // this.authService.logout();

    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (data: any) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login error:', error);
          alert('Login failed. Please try again.');
        },
        complete: () => {
          console.log('Login request completed');
        },
      });
    } else {
      alert('Error! Invalid login');
    }
  }
}
