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

  public deleteProduct(productId: number): Observable<Product[]> {
    let product: Product = this.data.find((p) => p.id === productId);
    let idx = this.data.indexOf(product);
    
    if (idx < 0) {
      // warning product does not exist
      throw new Error('Product with id ' + productId + ' does not exist');
    } else {
      this.data.splice(idx, 1);
    }

    return of(this.data);
  }
  
  public deleteMultipleProducts(selectedProducts: Product[]): Observable<Product[]> {
    let arrIdx: number[] = [];
    let errorUnknownProduct: boolean = false;

    selectedProducts.forEach((prod) => {
      let idx = this.data.indexOf(prod);

      if (idx < 0) {
        // warning product does not exist
        errorUnknownProduct = true;
      } else {
        this.data.splice(idx, 1);
      }
    });

    if(errorUnknownProduct)
      console.log("One product (at least) was unknown");

    return of(this.data);
  }
}
