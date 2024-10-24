import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl: string = environment.apiUrl;

  /**
   * Se obtiene token
   * @returns string
   */
  private getHttpOptions() {
    const accessToken = localStorage.getItem('token')?.replace(/['"]+/g, '');

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }),
    };
  }

  constructor(private http: HttpClient) { }

  listUser(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/listUser`, { ...this.getHttpOptions() });
  }

  createUser(data:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/createUser`, data, { ...this.getHttpOptions() });
  }

  editUser(data:any, id:number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/editUser/` + id, data, { ...this.getHttpOptions() });
  }

  deleteUser(id:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user/deleteUser/` + id, { ...this.getHttpOptions() });
  }
}
