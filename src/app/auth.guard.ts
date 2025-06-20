import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');

    console.log('AuthGuard check — token:', token, 'userId:', userId); // ✅ Add this

    if (token && userId) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
