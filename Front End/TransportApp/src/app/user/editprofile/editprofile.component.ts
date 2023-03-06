import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouteService } from 'src/app/services/route.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from '../../environment/environment';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.css']
})
export class EditprofileComponent {

  constructor(private fb: FormBuilder, private userService: UserService, private routeService: RouteService, private snackBar: MatSnackBar) {
    userService.userId.subscribe(data => {
      this.userId = data;
      userService.getProfile(data).subscribe(data => {
        this.updateUser = data;
      })
    });
  }

  //to declare the form group and the validators on the respective inputs
  updateForm = this.fb.group({
    firstName: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
    lastName: new FormControl('', { validators: [Validators.required], updateOn: 'blur' }),
    dateOfBirth: new FormControl('', { validators: [Validators.required], updateOn: 'blur' })
  })

  //to reference the respective fields for the validation to work
  get firstName() { return this.updateForm.get('email') }
  get lastName() { return this.updateForm.get('password') }
  get dateOfBirth() { return this.updateForm.get('dateOfBirth') }

  userId: any = '';
  updateUser: any = {};
  isLoading: boolean = false;
  response!: { dbPath: ''; };

  uploadFinished = (event: any) => {
    this.response = event;
  }

  onCreate = () => {
    this.updateUser.profilePicture = this.response.dbPath;
    this.updateUser.updatedBy = this.updateUser.userId;
    this.userService.updateProfile(this.updateUser.userId, this.updateUser).subscribe((data: any) => {
      this.snackBar.open("Image successfully uploaded", "Close", {
        verticalPosition: 'top'
      });
    });
  }

  updateProfileSubmit() {
    this.isLoading = true;
    this.userService.updateProfile(this.userId, this.updateUser).subscribe((data: any) => {
      // behaviour subject triggered to update all subscriber components on latest user data
      this.userService.userEmail.next(this.updateUser.email);
      this.isLoading = false;
      this.snackBar.open("Profile updated successfully!", "Close", {
        verticalPosition: 'top'
      });
      this.routeService.routeToProfile();
    });
  }

}
