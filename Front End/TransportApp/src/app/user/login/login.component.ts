import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { RouteService } from '../../services/route.service';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private fb: FormBuilder, private user: UserService, private route: RouteService, private snackBar: MatSnackBar) { }

  //to declare the form group and the validators on the respective inputs
  loginForm = this.fb.group({
    email: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'blur' }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' }),
  })

  //to reference the respective fields for the validation to work
  get email() { return this.loginForm.get('email') }
  get password() { return this.loginForm.get('password') }

  isLoading?: boolean;

  loginSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      //onSubmit function will call the login service to validate the login data with the data in the auth server
      this.user.login(this.loginForm.value).subscribe((data: any) => {
        this.user.setBearerToken(data.token);
        this.user.getProfileByEmail(this.loginForm.value.email).subscribe((data: any) => {
          // checks if user has been blocked before proceeding with login process
          if (data.isActive) {
            this.user.setUser(JSON.stringify({userEmail: data.email, isLoggedIn: true}));
            this.user.userId.next(data.userId);
            this.user.userEmail.next(data.email);
            this.user.userName.next(data.firstName);
            this.user.isAdmin.next(data.isAdmin);
            this.user.isLoggedIn.next(true);
            this.isLoading = false;
            this.snackBar.open(`Welcome back, ${data.firstName}!`, "Close", {
              verticalPosition: 'top',
              duration: 5000,
              panelClass: ['alert-snackbar']
            });
            //user will be redirected to the homepage after a successful login
            this.route.routeToProfile();
          }
          else {
            this.isLoading = false;
            localStorage.clear();
            this.snackBar.open("Your account has been blocked, please contact admin@busybees.com", "OK", {
              verticalPosition: 'top'
            });
          }
        })
      }, (error: any) => {
        //if error is user not verified, route to restricted page
        if (error.error == 'User not verified') {
          this.user.isLoggedIn.next(false);
          this.route.routeToRestricted();
        } else {
          //if user entered the wrong credentials, server error message will be displayed on the screen
          this.snackBar.open(error.error, "OK", {
            verticalPosition: 'top'
          });
          this.isLoading = false;
        }
      })
    } else {
      this.snackBar.open("Please fill in the required fields!", "OK", {
        verticalPosition: 'top'
      });
    }
  }
}
