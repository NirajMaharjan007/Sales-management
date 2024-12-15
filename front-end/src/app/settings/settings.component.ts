import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  user: any;
  form: FormGroup;
  router = inject(Router);

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    try {
      this.fetch();
    } catch (error) {
      console.log(error);
      this.router.navigate(['/404/']);
    }
  }

  private fetch() {
    this.user = this.userService.getUser();
  }

  submit() {
    console.log('GG');
  }
}
