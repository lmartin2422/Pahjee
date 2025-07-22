import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Initialize token and userId as null
    let token = null;
    let userId = null;

    // Check if window and localStorage are available
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token');
      userId = localStorage.getItem('user_id');
    }

    // Log token and userId for debugging purposes
    console.log('AuthGuard check — token:', token, 'userId:', userId); 

    // If token and userId exist, allow access to the route
    if (token && userId) {
      return true;
    }

    // If not authenticated, navigate to the login page
    this.router.navigate(['/login']);
    return false;
  }
}




// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private router: Router) {}

// //   canActivate(): boolean {
// //     const token = localStorage.getItem('access_token');
// //     const userId = localStorage.getItem('user_id');

// //     console.log('AuthGuard check — token:', token, 'userId:', userId); // ✅ Add this

// //     if (token && userId) {
// //       return true;
// //     }

// //     this.router.navigate(['/login']);
// //     return false;
// //   }
// // }

// canActivate(): boolean {
//     let token = null;
//     let userId = null;

//     if (typeof window !== 'undefined') {
//       token = localStorage.getItem('access_token');
//       userId = localStorage.getItem('user_id');
//     }

//     console.log('AuthGuard check — token:', token, 'userId:', userId); // ✅ Add this

//     if (token && userId) {
//       return true;
//     }

//     this.router.navigate(['/login']);
//     return false;
//   }
// }
