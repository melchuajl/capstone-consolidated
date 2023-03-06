import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { RouteService } from '../services/route.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private user: UserService, private route: RouteService, private snackBar: MatSnackBar) {
    user.userEmail.subscribe(data => {
      this.userEmail = data;
    })
  }

  userEmail: string = '';

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // using promise to get user's profile via email and check if user is an admin
    return this.user.getProfileByEmail(this.userEmail).pipe(
      map((data: any) => {
        if (data.isAdmin == 1) {
          // Return true only if the user is an admin
          return true;
        } else {
          // Return false if the user is not an admin
          return false;
        }
      }),
      catchError((err: HttpErrorResponse) => {
        this.snackBar.open(err.error, "OK", {
          verticalPosition: 'top'
        });
        this.route.routeToLogin();
        return throwError(err);
      })
    );
  }
}