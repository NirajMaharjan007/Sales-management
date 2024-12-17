import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [],
  templateUrl: './password.component.html',
  styleUrls: ['../settings.component.css', './password.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // Initial state
      transition(':enter', [animate('300ms ease-in')]), // Enter transition
      transition(':leave', [animate('300ms ease-out')]), // Leave transition
    ]),
  ],
})
export class PasswordComponent {}
