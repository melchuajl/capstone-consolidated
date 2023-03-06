import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../environment/environment';
import { AdminService } from '../services/admin.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.css']
})
export class ManageusersComponent {

  constructor(private adminService: AdminService, private userService: UserService, private snackBar: MatSnackBar) {
    userService.userId.subscribe((data: any) => {
      this.userId = data;
    })
  }

  users: Array<any> = [];
  updateuser: any = {};
  isChecked: boolean = true;
  userId: any = '';

  ngOnInit() {
    this.adminService.getallusers().subscribe((data: any) => data.map((item: any) => {
      if (!item.isAdmin) {
        this.users.push(item);
      }
    }))
  }

  displayStatus(data: any) {
    this.adminService.getuser(data).subscribe((data: any) => {
      this.updateuser = data;
      this.isChecked = data.isActive;
      data.updatedBy = this.userId;
    })
  }

  updateUserStatus() {
    this.updateuser.isActive = this.isChecked;
    this.adminService.changeuserstatus(this.updateuser.userId, this.updateuser).subscribe(data => {
      this.snackBar.open(`User status for ${this.updateuser.firstName} ${this.updateuser.lastName} has been updated`, "OK", {
        verticalPosition: 'top'
      });
    })
  }

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  }
}
