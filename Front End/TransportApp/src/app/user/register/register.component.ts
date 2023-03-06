import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteService } from '../../services/route.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(private fb: FormBuilder, private user: UserService, private route: RouteService, private snackBar: MatSnackBar) { }

  registerForm = this.fb.group({
    firstName: new FormControl('', { validators: [Validators.required, Validators.minLength(4)], updateOn: 'blur' }),
    lastName: new FormControl('', { validators: [Validators.required, Validators.minLength(2)], updateOn: 'blur' }),
    email: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'blur' }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' }),
    dateOfBirth: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' })
  })

  get firstname() { return this.registerForm.get('firstname') }
  get lastname() { return this.registerForm.get('lastname') }
  get email() { return this.registerForm.get('email') }
  get password() { return this.registerForm.get('password') }
  get dateOfBirth() { return this.registerForm.get('dateOfBirth') }

  response!: { dbPath: ''; };
  profilePicture?: any;
  isLoading: boolean = false;

  uploadFinished = (event: any) => {
    this.response = event;
  }

  onCreate = () => {
    this.profilePicture = this.response.dbPath;
    this.snackBar.open("Image successfully uploaded", "Close", {
      verticalPosition: 'top'
    });
  }

  onSubmit() {
    this.isLoading = true;
    if (this.registerForm.valid) {
      this.user.register({ ...this.registerForm.value, profilePicture: this.profilePicture }).subscribe(data => {
        this.snackBar.open("Account registered successfully", "Close", {
          verticalPosition: 'top'
        });
        // console.log(this.registerForm.value);
        // Emitting important data that other components will need to render user information 
        this.user.userEmail.next(this.registerForm.value.email!);
        this.user.isLoggedIn.next(true);
        this.user.userName.next(this.registerForm.value.firstName!);
        this.isLoading = false;
        this.route.routeToLogin();
      }, (error: any) => {
        this.isLoading = false;
        this.snackBar.open(error.error, "OK", {
          verticalPosition: 'top'
        });
      })
    } else {
      this.isLoading = false;
      this.snackBar.open("Invalid form! Please check again", "OK", {
        verticalPosition: 'top'
      });
    }
  }
}
