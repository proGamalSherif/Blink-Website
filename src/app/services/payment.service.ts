import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl: string = environment.apiUrl + '/payment'; 
  private paymentStatusSubject = new BehaviorSubject<string>('pending');
  paymentStatus$ = this.paymentStatusSubject.asObservable();
  
  constructor(private _HttpClient: HttpClient) {}

  createOrUpdatePaymentIntent(userId: string): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/${userId}`, {});
  }
 
  confirmPayment(userId:string ,paymentIntentId: string, isSucceeded: boolean,lat:number,long:number): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/confirmPayment/${userId}`, { paymentIntentId, isSucceeded,lat,long });  
  }

  setPaymentStatus(paymentIntentId: string): Observable<string> {
    return this._HttpClient.get<string>(`${this.baseUrl}/status/${paymentIntentId}`);
  }
}
