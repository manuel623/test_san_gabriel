import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VideosService {
  private apiUrl: string = environment.apiUrl;

  /**
   * Se obtiene token
   * @returns string
   */
  private getHttpOptions() {
    const accessToken = localStorage.getItem('token')?.replace(/['"]+/g, '');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    };
  }

  constructor(private http: HttpClient) { }

  listVideos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/video/listVideo`, { ...this.getHttpOptions() });
  }

  createVideo(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/video/createVideo`, formData, { ...this.getHttpOptions()});
  }

  updateVideo(id: number, formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/video/updateVideo/${id}`, formData, { ...this.getHttpOptions()});
  }

  deleteVideo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/video/deleteVideo/${id}`, { ...this.getHttpOptions()});
  }

  scheduleVideo(data:any){
    return this.http.post<any>(`${this.apiUrl}/schedule/scheduleVideo`, data, { ...this.getHttpOptions()});
  }

  listSchedule(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/schedule/listSchedule`, { ...this.getHttpOptions() });
  }

  getVideoShcedules(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getVideoShcedules`);
  }

}
