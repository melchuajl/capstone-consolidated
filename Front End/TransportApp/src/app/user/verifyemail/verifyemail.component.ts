import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteService } from 'src/app/services/route.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verifyemail',
  templateUrl: './verifyemail.component.html',
  styleUrls: ['./verifyemail.component.css']
})
export class VerifyemailComponent {

  constructor(private fb: FormBuilder, private userService: UserService, private routeService: RouteService, private snackBar: MatSnackBar) { }

  verifyForm = this.fb.group({
    verificationCode: new FormControl('', { validators: [Validators.required, Validators.minLength(20)], updateOn: 'blur' })
  })

  get verificationCode() { return this.verifyForm.get('verificationCode') }

  isLoading: boolean = false;

  verifyCodeSubmit() {
    this.isLoading = true;
    if (this.verifyForm.valid) {
      this.userService.verifyEmail(this.verificationCode?.getRawValue()).subscribe((data: any) => {
        this.isLoading = false;
        this.snackBar.open(data, "Close", {
          verticalPosition: 'top', 
          duration: 5000
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
      this.snackBar.open("Please check your token", "OK", {
        verticalPosition: 'top'
      });
    }
  }

}
