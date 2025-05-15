import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Discount } from '../models/discount';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  constructor(private httpClient:HttpClient) { }
  private apiUrl=environment.apiUrl;
  getRunningDiscounts():Observable<Discount[]>{
  return this.httpClient.get<Discount[]>(`${this.apiUrl}/Discount`)    
  }
  getDiscountById(discountId:number){
    return this.httpClient.get<Discount>(`${this.apiUrl}/Discount/${discountId}`)
  }
}
