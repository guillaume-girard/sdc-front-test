import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'app/models/product.model';
import db from '../../assets/products.json';
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';

const LOW_STOCK_LIMIT: number = 7;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) {}
  
  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }

  public getExistingCategories(): Observable<string[]> {
    return this.getAllProducts().pipe(
      map(allProducts => {
        let categories = new Set<string>();
        allProducts.forEach(product => { categories.add(product.category) });
        return categories;
      }),
      switchMap(categories => {
        return of(Array.from(categories))
      })
    )
  }
  
  public addProduct(newProduct: Product): Observable<Product> {

    this.setProductInventoryStatus(newProduct);

    // Generate uniq code then POST new product
    return this.getAllProducts().pipe(
      map(allProducts => {
        let newProductCode = "";
        do {
          newProductCode = Math.random().toString(16).slice(2);
        } while (allProducts.find((product) => product.code == newProductCode));

        return {
          ...newProduct,
          code: newProductCode
        }
      }),
      switchMap(newProduct => this.http.post<Product>(`http://localhost:3000/products`, newProduct))
    );
  }

  public updateProduct(productToUpdate: Product): Observable<Product> {
    this.setProductInventoryStatus(productToUpdate);
    // Remove id & code from product before patch
    let { id, code, ...productUpdated } = productToUpdate;

    return this.http.patch<Product>(`http://localhost:3000/products/` + id, productUpdated);
  }

  public deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`http://localhost:3000/products/` + productId);
  }
  
  public deleteMultipleProducts(selectedProducts: Product[]): Observable<any[]> {
    let arrObservables: Observable<any>[] = [];

    for (let i = 0; i < selectedProducts.length; i++) {
      arrObservables.push(this.deleteProduct(selectedProducts[i].id));
    }

    return forkJoin(arrObservables);
  }

  private setProductInventoryStatus(product: Product): void {
    if (!product.quantity || product.quantity == 0) {
      product.inventoryStatus = 'OUTOFSTOCK';
    } else if (product.quantity < LOW_STOCK_LIMIT) {
      product.inventoryStatus = 'LOWSTOCK';
    } else {
      product.inventoryStatus = 'INSTOCK';
    }
  }
}
