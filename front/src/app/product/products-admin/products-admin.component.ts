import { Component, OnInit } from '@angular/core';
import { Product } from 'app/models/product.model';
import { ProductsService } from 'app/services/products.service';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss']
})
export class ProductsAdminComponent implements OnInit {
  products!: Product[];
  selectedProducts!: Product[];
  voidSelection: boolean = true;
  totalRecords: number;

  constructor(
    private ProductService: ProductsService
  ) { }

  ngOnInit(): void {
    this.ProductService.getAllProducts().subscribe(products => {
      this.products = products;
      this.totalRecords = this.products.length;
    });
  }

  onSelectionChange(event: any): void {
    this.voidSelection = this.selectedProducts.length == 0;
  }

  onNewProduct(): void {
    console.log("new");
  }

  onEditProduct(product: Product): void {
    console.log("edit ", product);
  }

  onDeleteProduct(product: Product): void {
    console.log("delete ", product);
  }

  onDeleteSelectedProducts(): void {
    console.log("delete selected", this.selectedProducts);
  }

  onOpenConfig(): void {
    console.log("open config");
  }
}
