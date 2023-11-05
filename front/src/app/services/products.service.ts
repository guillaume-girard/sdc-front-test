import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'app/models/product.model';
import db from '../../assets/products.json';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

const LOW_STOCK_LIMIT: number = 7;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private data: Product[];
  
  constructor(
    private http: HttpClient
  ) {
    // @TODO supprimer
    this.data = db.data;
  }
  
  public getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('http://localhost:3000/products');
  }

  // @TODO use new Set() instead
  public getExistingCategories(): Observable<any[]> {
    return this.getAllProducts().pipe(
      map(allProducts => {
        let categories = [];

        for (let i = 0; i < allProducts.length; i++) {
          let p = allProducts[i];
          if (categories.indexOf(p.category) < 0) {
            categories.push(p.category);
          }
        }

        return categories.map(cat => {return {"name": cat, "value": cat}});
      }),
      switchMap(categories => {
        return of(categories)
      })
    )
  }
  
  public addProduct(newProduct: Product): Observable<Product> {
    // Generate code value
    let newProductCode = "";
    do {
      newProductCode = Math.random().toString(16).slice(2);
    } while (this.data.find((product) => product.code == newProductCode))

    newProduct.code = newProductCode;

    this.setProductInventoryStatus(newProduct);

    // Save new product in "database"
    return this.http.post<Product>(`http://localhost:3000/products`, newProduct);
  }

  public updateProduct(productToUpdate: Product): Observable<Product> {
    this.setProductInventoryStatus(productToUpdate);
    // Remove id & code from data before patch
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
