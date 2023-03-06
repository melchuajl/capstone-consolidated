import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {
    this.adminHeader = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  adminHeader: any;

  getallusers() {
    return this.http.get(`${environment.adminUrl}/allusers`, this.adminHeader)
  }

  getuser(id: any) {
    return this.http.get(`${environment.adminUrl}/${id}`, this.adminHeader)
  }

  changeuserstatus(id: any, user: any) {
    return this.http.put(`${environment.adminUrl}/userstatus/${id}`, user, this.adminHeader);
  }

  getBearerToken() {
    return localStorage.getItem('token');
  }

}
