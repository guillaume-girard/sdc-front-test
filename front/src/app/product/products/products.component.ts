import { Component, OnInit } from '@angular/core';
import { Product } from 'app/models/product.model';
import { ProductsService } from 'app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  layout: string = 'grid';
  allProducts!: Product[];
  displayedProducts!: Product[];
  sortOptions!: {label: string, value: string}[];
  sortKey: any;
  sortField: string;
  sortOrder: number;
  searchTimeout: any;

  constructor(
    private ProductService: ProductsService
  ) { }

  ngOnInit(): void {
    this.ProductService.getAllProducts().subscribe(products => {
      this.allProducts = products;
      this.displayedProducts = this.allProducts;
    });

    this.sortOptions = [
      {label: "Default sort", value: "id"},
      {label: "Price (Low to High)", value: "price"},
      {label: "Price (High to Low)", value: "!price"},
      {label: "Rating", value: "!rating"}
    ];
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  filterProduct(event: any) {
    clearTimeout(this.searchTimeout);
    
    this.searchTimeout = setTimeout(() => {
      let search = event.target.value.trim().toLowerCase();
      
      if (search.length === 0) {
        this.displayedProducts = this.allProducts;
      } else {
        this.displayedProducts = this.allProducts.filter((object) => {
          return object.name.trim().toLowerCase().includes(search) || 
          object.description.trim().toLowerCase().includes(search) || 
          object.category.trim().toLowerCase().includes(search)
        });
      }
    }, 800);
  }

}
