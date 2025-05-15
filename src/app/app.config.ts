import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { headerInterceptor } from './Interceptors/header.interceptor';

import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './Interceptors/loading.interceptor';



export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimationsAsync(),

    provideHttpClient(withInterceptors([headerInterceptor,loadingInterceptor])),
    importProvidersFrom(NgxSpinnerModule ),
    
  ]

};
