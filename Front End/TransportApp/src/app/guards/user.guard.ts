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
export class UserGuard implements CanActivate {

  constructor(private user: UserService, private route: RouteService, private snackBar: MatSnackBar) {
    user.userEmail.subscribe(data => {
      this.userEmail = data;
    })
  }

  userEmail: string = '';

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //to get user's profile by their email before checking if user is blocked 
    return this.user.getProfileByEmail(this.userEmail).pipe(
      //user's profile will be accessed first, before tokenchecker is executed
      switchMap((userdets: any) => {
        return this.user.isAuthenticated().pipe(
          map((data: any) => {
            if (data && userdets.isActive == 1) {
              // Return true only if the user is not blocked
              return true;
            }
            // Return false if the user is blocked (aka isActive == 0)
            this.snackBar.open(`Your account has been blocked \n Please contact admin@busybees.com`, "OK", {
              verticalPosition: 'top'
            });
            return false;
          }),
          catchError((err: HttpErrorResponse) => {
            this.route.routeToLogin();
            this.snackBar.open(err.error, "OK", {
              verticalPosition: 'top'
            });
            return throwError(err);
          })
        );
      })
    );
  }
}
