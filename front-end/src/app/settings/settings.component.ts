import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    CommonModule,
    NgClass,
    RouterLink,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // Initial state
      transition(':enter', [animate('300ms ease-in')]), // Enter transition
      transition(':leave', [animate('300ms ease-out')]), // Leave transition
    ]),
  ],
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

  isRoute(path: string) {
    return this.router.url.includes(path);
  }

  submit() {
    console.log('GG');
  }
}
