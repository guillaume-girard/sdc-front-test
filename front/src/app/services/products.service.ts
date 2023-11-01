import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'app/models/product.model';
import db from '../../assets/products.json';

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
    
  public getAllProducts(): Product[] {
    return this.data;
  }
}
