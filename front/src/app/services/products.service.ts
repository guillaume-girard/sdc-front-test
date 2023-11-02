import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'app/models/product.model';
import db from '../../assets/products.json';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private data: any;
  
  constructor(
    private http: HttpClient
  ) {
    this.data = db.data;
  }
    
  public getAllProducts(): Observable<Product[]> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.data);
        observer.complete();
      }, 400);
    });
  }
}
