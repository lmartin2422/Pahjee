import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Enables HTTP requests
    importProvidersFrom(ReactiveFormsModule, HttpClientModule), // Enables reactive forms
    provideZoneChangeDetection({ eventCoalescing: true }), // Fixed: zone change detection
    provideRouter(routes, withComponentInputBinding()), // Router
    provideClientHydration()
  ]
};
