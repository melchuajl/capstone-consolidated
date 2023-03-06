import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  // getTrafficAlerts() {
  //   return this.http.get(environment.dataMallUrl, {
  //     headers: {
  //       'AccountKey': environment.dataMallAccountKey, 
  //     }
  //   });
  // }
}
