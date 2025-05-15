import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private httpClient:HttpClient) { }
  private apiUrl=environment.apiUrl;
  getAllParentCategory():Observable<Category[]>{
    return this.httpClient.get<Category[]>(`${this.apiUrl}/Category/GetParentCategories`)
  }


  //modification 
GetAllChildCategories():Observable<Category[]>{
  return this.httpClient.get<Category[]>(`${this.apiUrl}/Category/GetChildCategories`)
}

getChildCategoriesById(id:number):Observable<Category>{
  return this.httpClient.get<Category>(`${this.apiUrl}/Category/GetChildCategoryById?id=${id}`)
}

getParentCategoryById(id:number):Observable<Category>{
  return this.httpClient.get<Category>(`${this.apiUrl}/Category/GetParentCategoryById?id=${id}`)
}

getChildCategoriesByParentId(id:number):Observable<Category[]>{
  return this.httpClient.get<Category[]>(`${this.apiUrl}/Category/GetChildCategoryByParentId?id=${id}`)
}

}

