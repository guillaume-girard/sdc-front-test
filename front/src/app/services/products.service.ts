import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'app/models/product.model';
import db from '../../assets/products.json';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private data: Product[];
  
  constructor(
    private http: HttpClient
  ) {
    this.data = db.data;
  }
    
  public getAllProducts(): Observable<Product[]> {
    return of(this.data);
    // return this.http.get<Product[]>(...);
  }
}
