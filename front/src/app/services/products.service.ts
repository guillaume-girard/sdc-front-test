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

  public getExistingCategories(): any[] {
    let categories = [];

    for (let i = 0; i < this.data.length; i++) {
      let entry = this.data[i];
      if (categories.indexOf(entry.category) < 0) {
        categories.push(entry.category);
      }
    }

console.log(categories);
    return categories.map((entry) => { 
      let o = {name: entry};
      return o;
    });
    
  }
  
  public addProduct(newProduct: Product): Observable<Product[]> {
    // Generate id & code values
    let newProductCode = "";
    do {
      newProductCode = Math.random().toString(16).slice(2);
    } while (this.data.find((product) => product.code == newProductCode))

    let arrayIds = (this.data.map((prod) => prod.id)).sort((a, b) => a - b);
    let newProductId = arrayIds[arrayIds.length - 1] + 1;

    newProduct.id = newProductId;
    newProduct.code = newProductCode;

    this.setProductInventoryStatus(newProduct);

    // Save new product in "database"
    this.data.push(newProduct);

    return of(this.data);
  }

  public updateProduct(productUpdated: Product): Observable<Product[]> {
    let idx = this.data.findIndex((product) => product.id == productUpdated.id);
    
    if (idx < 0) {
      throw new Error('Product with id ' + productUpdated.id + ' does not exist');
    } else {
      this.setProductInventoryStatus(productUpdated);
      this.data[idx] = productUpdated;
    }

    return of(this.data);
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

  private setProductInventoryStatus(product: Product): void {
    if (!product.quantity || product.quantity == 0) {
      product.inventoryStatus = 'OUTOFSTOCK';
    } else if (product.quantity < 7) {
      product.inventoryStatus = 'LOWSTOCK';
    } else {
      product.inventoryStatus = 'INSTOCK';
    }
  }
}
