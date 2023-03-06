import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ChangepasswordComponent } from './user/changepassword/changepassword.component';
import { EditprofileComponent } from './user/editprofile/editprofile.component';
import { FavesComponent } from './transport/faves/faves.component';
import { AdminGuard } from './guards/admin.guard';
import { LoginComponent } from './user/login/login.component';
import { MainComponent } from './transport/main/main.component';
import { ManageusersComponent } from './manageusers/manageusers.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProfileComponent } from './user/profile/profile.component';
import { RegisterComponent } from './user/register/register.component';
import { RoutesComponent } from './transport/routes/routes.component';
import { ViewprofileComponent } from './user/viewprofile/viewprofile.component';
import { RecoverpasswordComponent } from './user/recoverpassword/recoverpassword.component';
import { RecoverpasswordSentComponent } from './user/recoverpassword-sent/recoverpassword-sent.component';
import { RecoverpasswordChangeComponent } from './user/recoverpassword-change/recoverpassword-change.component';
import { VerifyemailComponent } from './user/verifyemail/verifyemail.component';
import { RestrictedComponent } from './user/restricted/restricted.component';
import { UserGuard } from './guards/user.guard';
// import { UserGuard } from './guards/user.guard';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: '', component: RoutesComponent },
      { path: 'faves', component: FavesComponent },
    ]
  },
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [UserGuard],
    children: [
      { path: '', component: ViewprofileComponent },
      { path: 'edit', component: EditprofileComponent },
      { path: 'change-password', component: ChangepasswordComponent }
    ]
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: RecoverpasswordComponent },
  { path: 'forgot-password-sent', component: RecoverpasswordSentComponent },
  { path: 'forgot-password-change', component: RecoverpasswordChangeComponent },
  { path: 'verify-email', component: VerifyemailComponent },
  { path: 'restricted', component: RestrictedComponent },
  {
    path: 'admin', component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: ManageusersComponent },
      // { path: ':id', component: ViewprofileComponent },
      // { path: ':id/edit', component: EditprofileComponent }
    ]
  },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
