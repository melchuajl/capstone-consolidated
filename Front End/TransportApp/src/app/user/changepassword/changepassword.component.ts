import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteService } from 'src/app/services/route.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent {

  constructor(private fb: FormBuilder, private userService: UserService, private routeService: RouteService, private snackBar: MatSnackBar) {
    userService.userEmail.subscribe(data => this.userEmail = data);
  }

  //to declare the form group and the validators on the respective inputs
  changePasswordForm = this.fb.group({
    oldPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' }),
    newPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' }),
    confirmPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' })
  })

  //to reference the respective fields for the validation to work
  get oldPassword() { return this.changePasswordForm.get('oldPassword') }
  get newPassword() { return this.changePasswordForm.get('newPassword') }
  get confirmPassword() { return this.changePasswordForm.get('confirmPassword') }

  userEmail: any = '';

  changePasswordSubmit() {
    if (this.changePasswordForm.valid) {
      this.userService.changePassword({ email: this.userEmail, ... this.changePasswordForm.value }).subscribe(data => {
        // console.log(data);
        this.snackBar.open("Password changed successfully!", "Close", {
          verticalPosition: 'top',
          duration: 5000
        });
        this.routeService.routeToProfile();
      }, (error: any) => {
        //if user entered the wrong credentials, server error message will be displayed on the screen
        this.snackBar.open(error.error, "OK", {
          verticalPosition: 'top'
        });
      })
    }
    else {
      this.snackBar.open("Please fill in the required fields!", "OK", {
        verticalPosition: 'top'
      });
    }
  }

}
