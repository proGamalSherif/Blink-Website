import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ObservedValueOf } from 'rxjs';
import { Product } from '../models/product';
import { environment } from '../../environments/environment.development';
import { Attribute } from '../models/attribute';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient : HttpClient) { }
  private apiUrl = environment.apiUrl;
  // getAllProducts() : Observable<Product[]>{
  //   return this.httpClient.get<Product[]>(`${this.apiUrl}/product`);
  // }
  // getProductById(id : number) : Observable<Product>{
  //   return this.httpClient.get<Product>(`${this.apiUrl}/product/getbyid/${id}`);
  // }
  GetAll():Observable<Product[]>{
    return this.httpClient.get<Product[]>(`${this.apiUrl}/Product/GetAllWithPaging/1/8`);
  }
  GetById(id:number):Observable<Product>{
    return this.httpClient.get<Product>(`${this.apiUrl}/Product/${id}`);
  }

  getAllAttributes():Observable<Attribute[]>{
    return this.httpClient.get<Attribute[]>(`${this.apiUrl}/Product/GetFilterAttributes`);
  }


  getFilteredProducts( pgNumber : number,  fromPrice : number | -1 , toPrice : number | -1, rating : number = -1 , categoryId : number = -1 , params : HttpParams): Observable<Product[]> 
  {
    
    return this.httpClient.get<Product[]>(`${this.apiUrl}/Product/GetFillteredProducts/${pgNumber}/${fromPrice}/${toPrice}/${rating}/${categoryId}`, { params });
  }

  GetTotalPages(pgSize:number):Observable<number>{
    return this.httpClient.get<number>(this.apiUrl + '/product/GetPagesCount/' + pgSize);
  }

  addReview(review: Review): Observable<Review> {
    return this.httpClient.post<Review>(`${this.apiUrl}/Product/AddReview`, review);
  }

  canUserAddReview(productId: number, userId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiUrl}/Product/CheckUserAvailableToReview/${userId}/${productId}`);
  }

}
