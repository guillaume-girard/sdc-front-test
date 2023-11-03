import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'app/models/product.model';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  product: Product;
  mode: string;
  existingCategories: any[];
  productForm: FormGroup;

  constructor(
      public ref: DynamicDialogRef, 
      public config: DynamicDialogConfig, 
      private fb: FormBuilder
  ) {
    this.product = config.data.product;
    this.mode = config.data.mode;
    this.existingCategories = config.data.categories;
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: [this.product.name, Validators.required],
      description: [this.product.description],
      image: [this.product.image],
      price: [this.product.price, Validators.required],
      category: [this.product.category],
      quantity: [this.product.quantity],
      rating: [this.product.rating]
    });
  }

  submitForm(newProduct: Product): void {
    this.product = {
      ...this.productForm.value,
      id: this.product.id,
      code: this.product.code,
    };
    
    this.ref.close(this.product);
  }

}
