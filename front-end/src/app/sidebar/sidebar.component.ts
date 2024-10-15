import { Component, OnInit } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    MatCardModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  currentRoute = '/home';

  constructor(private router: Router) {}
  ngOnInit(): void {
    // Listen for route changes and set the currentRoute
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }

  isHomeActive(): boolean {
    return this.currentRoute.startsWith('/home');
  }

  isTaxActive(): boolean {
    return this.currentRoute.startsWith('/tax/');
    // this.currentRoute == '/tax' ||
    // this.currentRoute == '/tax/create' ||
    // this.currentRoute == '/tax/manage' ||
  }

  isCategoryActive(): boolean {
    return this.currentRoute.startsWith('/categories/');
  }

  isProductActive(): boolean {
    return this.currentRoute.startsWith('/products/');
  }

  isUnitActive(): boolean {
    return this.currentRoute.startsWith('/units/');
  }
}
