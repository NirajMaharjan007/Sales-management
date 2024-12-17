import { Component, inject, Input, OnInit } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '../services/user.service';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatMenuModule, MatCardModule, NgIf, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  @Input() content: string = '';

  router = inject(Router);
  user: any;
  imageUrl: string = '';

  constructor(
    private userService: UserService,
    private authServer: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
    this.userService.getUserImageById(this.user.id).subscribe({
      next: (file: Blob) => {
        this.imageUrl = URL.createObjectURL(file);
      },
    });
  }

  logout(id: any): void {
    try {
      if (this.authServer.logout()) {
        this.router.navigate(['/login']);
        console.log('Logged out');
      } else {
        this.router.navigate(['/404']);
        console.error('Error in logout');
      }
    } catch (error) {
      console.error('Error in logout:', error);
      // this.router.navigate(['/500']);
    }
  }
}
