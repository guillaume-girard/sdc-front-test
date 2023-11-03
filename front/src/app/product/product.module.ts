import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products/products.component';
import { ProductsAdminComponent } from './products-admin/products-admin.component';
import { ProductFormComponent } from './products-admin/product-form/product-form.component';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductsAdminComponent,
    ProductFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    SelectButtonModule
  ],
  exports: [ProductsComponent, ProductsAdminComponent]
})
export class ProductModule {}
