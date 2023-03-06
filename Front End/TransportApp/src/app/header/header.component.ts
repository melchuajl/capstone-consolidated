import { Component } from '@angular/core';
import { environment } from '../environment/environment';
import { DataService } from '../services/data.service';
import { RouteService } from '../services/route.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private route: RouteService, private dataMall: DataService, private userService: UserService) {
    // userService.userName.subscribe(data => {
    //   this.userName = data;
    // });
    // this.userStorage = userService.getUser(); 
    // userService.getProfileByEmail(this.userStorage.userEmail).subscribe((data: any) => {
    //   this.currentUser = data;
    // });
    userService.isLoggedIn.subscribe(data =>{
      this.isLoggedIn = data;
    })
    userService.userEmail.subscribe(data => {
      userService.getProfileByEmail(data).subscribe((data: any) => {
        this.currentUser = data;
      })
    });
  }

  isLoggedIn: boolean = false;
  currentUser: any = {};
  // userStorage?: any;

  ngOnInit() {
    this.userService.isLoggedIn.subscribe(data => {
      this.isLoggedIn = data;
    });
    this.userService.userEmail.subscribe(data => {
      this.userService.getProfileByEmail(data).subscribe((data: any) => {
        this.currentUser = data;
      })
    })
  }

  logIn = () => {
    this.route.routeToLogin();
  }

  logOut = () => {
    localStorage.clear();
    this.isLoggedIn = false;
    this.userService.userEmail.next('');
    this.userService.userId.next('');
    this.userService.isAdmin.next(false);
    this.userService.userName.next('');
    this.route.routeToDashboard();
  }

  public createImgPath = (serverPath: string) => {
    return `${environment.apiUrl}/${serverPath}`;
  }

}
