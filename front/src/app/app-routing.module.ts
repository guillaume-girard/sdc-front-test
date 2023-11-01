import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './product/products/products.component';
import { ProductsAdminComponent } from './product/products-admin/products-admin.component';

const routes: Routes = [
  {path: 'products', component: ProductsComponent},
  {path: 'admin/products', component: ProductsAdminComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})

export class AppRoutingModule {}
