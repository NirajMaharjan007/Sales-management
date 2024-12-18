import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['../settings.component.css', './profile.component.css'],

  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })), // Initial state
      transition(':enter', [animate('300ms ease-in')]), // Enter transition
      transition(':leave', [animate('300ms ease-out')]), // Leave transition
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  selectedFile: any;
  user: any;
  details: any;
  imageUrl: string = '';

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', Validators.required],
      profile_picture: [null, Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.fetch();
  }

  private fetch() {
    this.user = this.userService.getUser();

    this.userService.getUserDetailsById(this.user.id).subscribe({
      next: (res) => {
        this.details = res;
      },
      error: (err) => {
        console.error(err.message);
      },
      complete: () => {
        if (this.details) {
          this.form.patchValue({
            bio: this.details.bio,
            phone: this.details.phone,
            address: this.details.address,
            gender: this.details.gender,
            dob: this.details.date_of_birth,
          });
          this.loadImage();
        }
      },
    });

    this.form.patchValue({
      username: this.user.username,
      firstName: this.user.first_name,
      lastName: this.user.last_name,
      email: this.user.email,
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  loadImage() {
    this.userService.getUserImageById(this.user.id).subscribe({
      next: (file: Blob) => {
        console.log(file);
        try {
          this.imageUrl = URL.createObjectURL(file);
        } catch (error) {
          console.error('Error:', error);
        }
      },
      error: (err) => {
        console.error('Error API:', err.message);
      },
    });
  }

  submit() {
    console.info(JSON.stringify(this.form.value, null, 2), this.form.valid);
    if (this.form.valid && this.selectedFile) {
      this.userService.setUserImage(this.user.id, this.selectedFile).subscribe({
        next: (res) => {
          console.log('Done updating profile picture');

          this.userService.setUserDetails(this.user.id, res).subscribe({
            next: () => {
              console.log('Done updating user details');
              alert('Profile updated successfully');
            },
            error: (err) => {
              console.error('USER detail Error:', err.message);
              alert('Failed to update user details');
            },
          });
        },
        error: (err) => {
          console.error('USER image Error:', err.message);
          alert('Failed to update profile picture');
        },
      });
    } else {
      console.log('Form is not valid');
      alert('Form is not valid');
    }
  }
}
