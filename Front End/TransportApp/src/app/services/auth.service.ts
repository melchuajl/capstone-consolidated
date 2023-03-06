import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private path = environment.apiUrl;

  public signOutExternal = () => {
    localStorage.removeItem('token');
    console.log('token deleted');
  }

}