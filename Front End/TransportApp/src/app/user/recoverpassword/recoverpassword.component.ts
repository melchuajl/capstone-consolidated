import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteService } from 'src/app/services/route.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-recoverpassword',
  templateUrl: './recoverpassword.component.html',
  styleUrls: ['./recoverpassword.component.css']
})
export class RecoverpasswordComponent {

  constructor(private fb: FormBuilder, private userService: UserService, private routeService: RouteService, private snackBar: MatSnackBar) { }

  forgotPasswordForm = this.fb.group({
    forgotPasswordEmail: new FormControl('', { validators: [Validators.required, Validators.email], updateOn: 'blur' })
  })

  //to reference the respective fields for the validation to work
  get forgotPasswordEmail() { return this.forgotPasswordForm.get('forgotPasswordEmail') }

  isLoading: boolean = false;

  sendForgotPasswordEmail() {
    this.isLoading = true;
    if (this.forgotPasswordForm.valid) {
      this.userService.sendForgotPassword(this.forgotPasswordEmail?.getRawValue()).subscribe(data => {
        this.isLoading = false;
        this.routeService.routeToForgotPasswordSent();
      }, (error: any) => {
        this.isLoading = false;
        this.snackBar.open(error.error, "OK", {
          verticalPosition: 'top'
        });
      })
    } else {
      this.isLoading = false;
      this.snackBar.open("Please enter a valid email", "OK", {
        verticalPosition: 'top'
      });
    }
  }

}
