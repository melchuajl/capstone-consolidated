import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FaveService {

  constructor(private http: HttpClient) { }

  getAllFavesByUser(userId: any) {
    return this.http.get(`${environment.faveUrl}/${userId}`)
  }

  AddToFav(data: any){
    return this.http.post(`${environment.faveUrl}/addtofav`, data);
  }

  DeleteFav(id: any) {
    return this.http.post(`${environment.faveUrl}/removefav/${id}`, null)
  }
}
