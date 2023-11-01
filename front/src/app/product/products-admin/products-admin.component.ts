import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/services/products.service';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss']
})
export class ProductsAdminComponent implements OnInit {

  constructor(
    private ProductService: ProductsService
  ) { }

  ngOnInit(): void {
    let prod = this.ProductService.getAllProducts();
    console.log(prod);
  }

}
