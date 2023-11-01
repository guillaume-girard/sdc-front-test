import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(
    private ProductService: ProductsService
  ) { }

  ngOnInit(): void {
    let prod = this.ProductService.getAllProducts();
    console.log(prod);
  }

}
