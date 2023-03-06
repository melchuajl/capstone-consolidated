import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public isLoggedIn = new BehaviorSubject(false);
  public isUser = new BehaviorSubject(false);
  public isAdmin = new BehaviorSubject(false);
  public userId = new BehaviorSubject('');
  public userEmail = new BehaviorSubject('');
  public userName = new BehaviorSubject('');

  constructor(private http: HttpClient) { }

  login(cred: any) {
    return this.http.post(`${environment.userUrl}/login`, cred);
  }

  register(user: any) {
    return this.http.post(`${environment.userUrl}/register`, user);
  }

  getProfile(id: any) {
    return this.http.get(`${environment.userUrl}/${id}`);
  }

  getProfileByEmail(email: any) {
    return this.http.get(`${environment.userUrl}/byemail?email=${email}`);
  }

  updateProfile(id: any, cred: any) {
    return this.http.put(`${environment.userUrl}/profile/${id}`, cred);
  }

  changePassword(data: any) {
    return this.http.put(`${environment.userUrl}/changepassword`, data); 
  }

  isAuthenticated() {
    return this.http.post(`${environment.userUrl}/authenticate`, null, {
      headers: {
        'Authorization': `Bearer ${this.getBearerToken()}`
      }
    })
  }

  setBearerToken(token: any) {
    return localStorage.setItem('token', token);
  }

  getBearerToken() {
    return localStorage.getItem('token');
  }

  setUser(data: any) {
    return localStorage.setItem('user', data); 
  }

  getUser() {
    return localStorage.getItem('user');
  }

  verifyEmail(token: any) {
    return this.http.post(`${environment.userUrl}/verify?token=${token}`, null);
  }

  sendForgotPassword(email: any) {
    return this.http.post(`${environment.userUrl}/forgot-password?email=${email}`, null)
  }

  resetPassword(data: any) {
    return this.http.put(`${environment.userUrl}/reset-password`, data);
  }
}
