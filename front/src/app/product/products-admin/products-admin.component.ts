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
    console.log("selection changed", event);
  }

  onSelectAllChange(event: any): void {
    console.log("selection all changed", event);
  }

}
