import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedGuard: CanActivateFn = (route, state) => {
 const _Router = inject(Router);
  
  if(localStorage.getItem('token') !== null){
    _Router.navigate(['/Homepage']); // Redirect to the homepage if the user is logged in
    return false; // User is logged in, prevent access to the login page
  } else {
    return true; // User is not logged in, allow access to the login page
  }
};
