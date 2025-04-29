// This page builds Angular HTTP Service
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignupData, User } from '../models/user.model'; // Import it



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:8000';  // FastAPI backend

  constructor(private http: HttpClient) { }

  loginUser(credentials: { username: string, password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }
  
  
  registerUser(user: SignupData): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/`);
  }

  updateUser(userId: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${userId}`, user);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }
}
