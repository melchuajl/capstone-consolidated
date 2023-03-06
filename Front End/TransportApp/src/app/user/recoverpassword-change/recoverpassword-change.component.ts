import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteService } from 'src/app/services/route.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-recoverpassword-change',
  templateUrl: './recoverpassword-change.component.html',
  styleUrls: ['./recoverpassword-change.component.css']
})
export class RecoverpasswordChangeComponent {

  constructor(private fb: FormBuilder, private userService: UserService, private routeService: RouteService, private snackBar: MatSnackBar) { }

  //to declare the form group and the validators on the respective inputs
  resetPasswordForm = this.fb.group({
    token: new FormControl('', { validators: [Validators.required, Validators.minLength(10)], updateOn: 'blur' }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' }),
    confirmPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(8)], updateOn: 'blur' })
  })

  //to reference the respective fields for the validation to work
  get token() { return this.resetPasswordForm.get('token') }
  get password() { return this.resetPasswordForm.get('password') }
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword') }

  isLoading: boolean = false;

  resetPasswordSubmit() {
    this.isLoading = true;
    if (this.resetPasswordForm.valid) {
      this.userService.resetPassword(this.resetPasswordForm.value).subscribe(data => {
        this.isLoading = false;
        this.snackBar.open("Password reset successfully", "OK", {
          verticalPosition: 'top'
        });
        this.routeService.routeToLogin();
      }, (error: any) => {
        this.isLoading = false;
        this.snackBar.open(error.error, "OK", {
          verticalPosition: 'top'
        });
      })
    }
    else {
      this.isLoading = false;
      this.snackBar.open("Please fill in the required fields!", "OK", {
        verticalPosition: 'top'
      });
    }
  }

}
