// This page builds Angular HTTP Service
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupData, User } from '../models/user.model';
import { Observable, BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://127.0.0.1:8000';  // FastAPI backend

   // ✅ Use window check for SSR-safe initialization
  private usernameSubject = new BehaviorSubject<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('username') : null
  );
  username$ = this.usernameSubject.asObservable();
  
  constructor(private http: HttpClient) { }

   // ✅ Set username after login
  setUsername(username: string) {
     if (typeof window !== 'undefined') {
      localStorage.setItem('username', username);
    }
    this.usernameSubject.next(username);
  }

  // ✅ Clear username on logout
  clearUsername() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('username');
    }
    this.usernameSubject.next(null);
  }

  loginUser(credentials: { username: string, password: string }) {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials);
  }
   
  registerUser(user: SignupData): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, user);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users/`);
  }

  updateProfile(userId: number, data: any) {
    return this.http.put(`${this.baseUrl}/users/${userId}`, data);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${userId}`);
  }

  searchUsers(filters: any): Observable<User[]> {
    return this.http.post<User[]>(`${this.baseUrl}/search`, filters);
  }


  favoriteUser(userId: number, favoriteUserId: number) {
    return this.http.post(`${this.baseUrl}/favorite`, {
      user_id: userId,
      favorite_user_id: favoriteUserId
    });
  }

  getFavorites(userId: number) {
    return this.http.get(`${this.baseUrl}/favorites/${userId}`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  // searchByUsername(username: string) {
  //   return this.http.get<any>(`${this.baseUrl}/users/by-username/${username}`);
  // }

  searchByUsername(username: string) {
  return this.http.get<any[]>(`${this.baseUrl}/users/by-username/${username}`);
}





  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/by-username/${username}`);
  }


  deactivateAccount(userId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${userId}/deactivate`, {});
  }


}


