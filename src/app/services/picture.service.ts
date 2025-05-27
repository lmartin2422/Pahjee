import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Picture {
  id: number;
  user_id: number;
  image_url: string;
  is_profile_picture: boolean;
}


@Injectable({ providedIn: 'root' })
export class PictureService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

uploadPicture(userId: number, file: File, isProfile: boolean = false): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  if (isProfile) {
    formData.append('profile_picture', 'true');
  }

  return this.http.post(`${this.baseUrl}/users/${userId}/upload_pictures`, formData);
}


  // Get all pictures for a specific user
  getUserPictures(userId: number): Observable<Picture[]> {
    return this.http.get<Picture[]>(`${this.baseUrl}/users/${userId}/pictures`);
  }

  // Set one of the user's pictures as profile picture
  setProfilePicture(userId: number, pictureId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}/pictures/${pictureId}/set-profile`, {});
  }

  // Optionally delete a picture
  deletePicture(userId: number, pictureId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}/pictures/${pictureId}`);
  }


}
