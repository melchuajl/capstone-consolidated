// Import modules
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';

// Import Angular material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from "@angular/material/snack-bar";

// Import components
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RoutesComponent } from './transport/routes/routes.component';
import { ResultsComponent } from './transport/results/results.component';
import { FavesComponent } from './transport/faves/faves.component';
import { MainComponent } from './transport/main/main.component';
import { DashboardComponent } from './transport/dashboard/dashboard.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { ProfileComponent } from './user/profile/profile.component';
import { ViewprofileComponent } from './user/viewprofile/viewprofile.component';
import { EditprofileComponent } from './user/editprofile/editprofile.component';
import { AdminComponent } from './admin/admin.component';
import { ManageusersComponent } from './manageusers/manageusers.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ChangepasswordComponent } from './user/changepassword/changepassword.component';
import { RecoverpasswordComponent } from './user/recoverpassword/recoverpassword.component';
import { RecoverpasswordSentComponent } from './user/recoverpassword-sent/recoverpassword-sent.component';
import { ImageuploadComponent } from './user/imageupload/imageupload.component';
import { FooterComponent } from './footer/footer.component';
import { RestrictedComponent } from './user/restricted/restricted.component';
import { VerifyemailComponent } from './user/verifyemail/verifyemail.component';
import { RecoverpasswordChangeComponent } from './user/recoverpassword-change/recoverpassword-change.component';
import { TimepipePipe } from './pipes/timepipe.pipe';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RoutesComponent,
    ResultsComponent,
    FavesComponent,
    MainComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    ViewprofileComponent,
    EditprofileComponent,
    AdminComponent,
    ManageusersComponent,
    NotFoundComponent,
    ChangepasswordComponent,
    RecoverpasswordComponent,
    RecoverpasswordSentComponent,
    ImageuploadComponent,
    FooterComponent,
    RestrictedComponent,
    VerifyemailComponent,
    RecoverpasswordChangeComponent,
    TimepipePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatSlideToggleModule, 
    MatPaginatorModule, 
    MatSelectModule, 
    GoogleMapsModule, 
    MatSnackBarModule,
    BrowserAnimationsModule,
    RouterModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
