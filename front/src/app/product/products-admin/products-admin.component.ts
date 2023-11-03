import { Component, OnInit } from '@angular/core';
import { Product } from 'app/models/product.model';
import { ProductsService } from 'app/services/products.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ProductsAdminComponent implements OnInit {
  products!: Product[];
  selectedProducts!: Product[];
  voidSelection: boolean = true;
  totalRecords: number;

  constructor(
    private ProductService: ProductsService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
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
    this.confirmationService.confirm({
      message: 'Do you really want to delete product ' + product.name + '?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.ProductService.deleteProduct(product.id).subscribe(products => {
          this.products = products;
          this.totalRecords = this.products.length;
          this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: "Product " + product.name + " deleted" });
        });
      },

      reject: (type: ConfirmEventType) => {
        console.log("delete product rejected");
      }
    });
  }

  onDeleteSelectedProducts(): void {
    // Avoid clickable delete button when disabled
    if (this.voidSelection) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Do you really want to delete these ' + this.selectedProducts.length + ' products?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',

      accept: () => {
        this.ProductService.deleteMultipleProducts(this.selectedProducts).subscribe(products => {
          this.products = products;
          this.totalRecords = this.products.length;
          this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: this.selectedProducts.length + " products deleted" });
          this.selectedProducts = [];
          this.voidSelection = true;
        });
      },
      
      reject: (type: ConfirmEventType) => {
        console.log("delete selected products rejected");
      }
    });
  }

  onOpenConfig(): void {
    console.log("open config");
  }
}
