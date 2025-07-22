import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // No need for HTTP_INTERCEPTORS here


// ✅ Define the functional interceptor
import { HttpInterceptorFn } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// ✅ Define the interceptor function here
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('access_token');
//   if (token) {
//     const authReq = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${token}`)
//     });
//     return next(authReq);
//   }
//   return next(req);
// };


// ✅ Define the interceptor function here
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token = null;

  // Check if localStorage is available in the browser
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('access_token');
  }

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor]) // ✅ Register the functional interceptor here
    ),
    importProvidersFrom(ReactiveFormsModule, HttpClientModule, BrowserAnimationsModule),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration()
  ]
};
