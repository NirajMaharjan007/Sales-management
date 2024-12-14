import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  user: any;

  router = inject(Router);

  constructor(private userService: UserService) {}

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
}
