import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ICreatOrder } from '../components/Orders/icreat-order';
import { Observable } from 'rxjs';
import { ConfirmedOrder } from '../Payment/iorder-dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private _HttpClient:HttpClient) { }

 
  

  creatOrder(orderData:ICreatOrder):Observable<any>{
    return this._HttpClient.post(`${environment.apiUrl}/order/create`,orderData);
  }

  getOrderByOrderID(orderId:number|null):Observable<any>{
    return this._HttpClient.get(`${environment.apiUrl}/order/${orderId}`);
  }

  deleteOrder(orderId:number):Observable<any>{
    return this._HttpClient.delete(`${environment.apiUrl}/order/${orderId}`);
  }
  getAllOrdersByUserID(): Observable<ConfirmedOrder[]> {
    return this._HttpClient.get<ConfirmedOrder[]>(`${environment.apiUrl}/order/GetOrdersByUserId`);
  }




}
 
