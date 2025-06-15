import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Picture {
  id: number;
  user_id: number;
  image_url: string;
  is_profile_pic: boolean;
}

@Injectable({ providedIn: 'root' })
export class PictureService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  uploadPicture(userId: number, file: File, isProfilePicture: boolean = false): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('profile_picture', String(isProfilePicture));
    return this.http.post(`${this.baseUrl}/users/${userId}/upload_pictures`, formData);
  }

  getUserPictures(userId: number): Observable<Picture[]> {
    return this.http.get<Picture[]>(`${this.baseUrl}/users/${userId}/pictures`);
  }

  setProfilePicture(userId: number, pictureId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}/pictures/${pictureId}/set-profile`, {});
  }

  deletePicture(userId: number, pictureId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}/pictures/${pictureId}`);
  }

  uploadMultiplePictures(userId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/users/${userId}/upload_pictures`, formData);
}

}
