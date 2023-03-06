import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/app/environment/environment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css']
})
export class ViewprofileComponent {

  constructor(private route: ActivatedRoute, private userService: UserService) {
    userService.userEmail.subscribe(data => {
      this.userEmail = data;
      userService.getProfileByEmail(data).subscribe(data => {
        this.currentUser = data;
        this.isLoading = false;
      })
    });
  }

  userId?: any = '';
  userEmail?: any = '';
  currentUser?: any = {};
  isLoading: boolean = true;

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  }

}
