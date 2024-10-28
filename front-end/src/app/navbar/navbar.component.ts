import { Component, inject, Input, OnInit } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../services/user.service';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatMenuModule, MatCardModule, NgIf, NgFor],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  @Input() content: string = '';

  router = inject(Router);
  user: any;

  constructor(
    private userService: UserService,
    private authServer: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  logout(): void {
    if (this.authServer.logout()) {
      this.router.navigate(['/login']);
      console.log('Logged out');
    } else {
      this.router.navigate(['/404']);
      console.error('Error in logout');
    }
  }
}
