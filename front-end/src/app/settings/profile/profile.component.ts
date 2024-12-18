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
        if (this.details !== undefined) {
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
      error: (err) => {
        console.error('Error fetching user details:', err.message);
      },
      complete: () => {
        this.userService.getUserById(this.user.id).subscribe((res) => {
          this.form.patchValue({
            username: res.username,
            firstName: res.first_name,
            lastName: res.last_name,
            email: res.email,
          });
        });
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  loadImage() {
    this.userService.getUserImageById(this.user.id).subscribe({
      next: (file: Blob) => {
        try {
          this.imageUrl = URL.createObjectURL(file);
        } catch (error) {
          console.error('Error Image:', error);
        }
      },
      error: (err) => {
        console.error('Error API:', err.message);
      },
    });
  }

  submit() {
    console.log(JSON.stringify(this.form.value, null, 2));
    if (this.form.valid && this.selectedFile) {
      this.userService.setUser(this.user.id, this.form.value).subscribe({
        next: () => {
          console.log('Done updating user details');
          if (this.details === undefined) {
            this.userService
              .setUserDetails(this.user.id, this.form.value, this.selectedFile)
              .subscribe({
                next: () => {
                  console.log('Done updating user image');
                  alert('Profile updated successfully');
                },
                error: (err) => {
                  console.error('Error creating user details', err.message);
                  alert('Error creating user details');
                },
              });
          } else {
            this.userService
              .updateUserDetails(
                this.user.id,
                this.form.value,
                this.selectedFile
              )
              .subscribe({
                next: () => {
                  console.log('Done updating user details');
                  alert('Profile updated successfully');
                },
                error: (err) => {
                  console.error('Error updating user details', err.message);
                  alert('Error updating user details');
                },
              });
          }
        },
        error: (err) => {
          console.error('Error updating user', err.message);
          alert('Error updating user profile');
        },
        complete: () => {
          window.location.reload();
        },
      });
    } else {
      console.log('Form is not valid');
      alert('Form is not valid');
    }

    // if (this.form.valid && this.selectedFile) {
    // Log form data entries
    // const entries = formData as any;
    // for (const pair of entries.entries()) {
    //   console.log(`${pair[0]}: ${pair[1]}`);
    // }
    // this.userService.setUser(this.user.id, formData).subscribe({
    //   next: () => {
    //     console.log('Done updating user details');
    //     alert('Profile updated successfully');
    //   },
    // });
    // } else {
    //   console.log('Form is not valid');
    //   alert('Form is not valid');
    // }
  }
}
