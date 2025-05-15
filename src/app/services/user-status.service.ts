import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStatusService {

  private userIsLoggedIn=new BehaviorSubject<boolean>(this.hasToken());

  constructor() { }

  private hasToken(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    const helper = new JwtHelperService();
    if (helper.isTokenExpired(token)) {
      localStorage.removeItem('token');
      return false;
    }
    return true;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.userIsLoggedIn.asObservable();
  }

}
