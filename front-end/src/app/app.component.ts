import { Component, OnInit } from '@angular/core';

import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Sales-Management';
  htmlContent = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Listen to route changes and update `str` based on the current URL
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd) // Only listen to NavigationEnd events
      )
      .subscribe(() => {
        if (this.router.url.startsWith('/home')) {
          this.htmlContent =
            '<div class="d-flex justify-content-around align-items-center"> \
            <i class="fas fa-tachometer-alt fa-fw me-2" aria-current="true"> </i> \
            <span> Dashboard </span></div>';
        } else if (this.router.url.startsWith('/tax')) {
          this.htmlContent =
            '<div class="d-flex justify-content-around align-items-center"> \
            <i class="fas fa-percent fa-fw me-2" aria-current="true"> </i> \
            <span> Tax Management </span></div>';
        } else if (this.router.url.startsWith('/categories')) {
          this.htmlContent =
            '<div class="d-flex justify-content-around align-items-center"> \
            <i class="fas fa-th fa-fw me-2" aria-current="true"> </i> \
            <span> Categories Management </span></div>';
        } else if (this.router.url.startsWith('/products')) {
          this.htmlContent =
            '<div class="d-flex justify-content-around align-items-center"> \
            <i class="fas fa-cube fa-fw me-2" aria-current="true"> </i> \
            <span> Products Management </span></div>';
        } else if (this.router.url.startsWith('/units')) {
          this.htmlContent =
            '<div class="d-flex justify-content-around align-items-center"> \
            <i class="fas fa-bars fa-fw me-2" aria-current="true"> </i> \
            <span> Units Management </span></div>';
        } else {
          this.htmlContent = '';
        }
        // this.str = this.router.url;
      });
  }
}
