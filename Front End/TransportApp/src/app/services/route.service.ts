import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  constructor(private route: Router) { }

  routeToDashboard() {
    return this.route.navigateByUrl("/");
  }

  routeToLogin() {
    return this.route.navigateByUrl('/login');
  }

  routeToAdmin() {
    return this.route.navigateByUrl('/admin');
  }

  routeToProfile() {
    return this.route.navigateByUrl('/profile');
  }

  routeToForgotPasswordSent() {
    return this.route.navigateByUrl('/forgot-password-sent');
  }

  routeToRestricted() {
    return this.route.navigateByUrl('/restricted');
  }
}
