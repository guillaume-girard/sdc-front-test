import { Component, OnInit } from '@angular/core';
import { Product } from 'app/models/product.model';
import { ProductsService } from 'app/services/products.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from './product-form/product-form.component';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrls: ['./products-admin.component.scss'],
  providers: [ConfirmationService, MessageService, DialogService]
})
export class ProductsAdminComponent implements OnInit {
  products!: Product[];
  selectedProducts!: Product[];
  voidSelection: boolean = true;
  totalRecords: number;

  constructor(
    private ProductService: ProductsService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) { }

  ref: DynamicDialogRef | undefined;

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
    let newProduct: Product = new Product();

    this.ref = this.dialogService.open(ProductFormComponent, {
      data: {
        product: newProduct,
        mode: "new"
      },
      header: 'Nouveau produit',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((product: Product) => {
      if (product) {
        this.ProductService.addProduct(product).subscribe(products => {
          this.products = products;
          this.totalRecords = this.products.length;
          this.messageService.add({ severity: 'info', summary: 'New product saved', detail: product.name });
        });
      }
    });
  }

  onEditProduct(productToUpdate: Product): void {
    this.ref = this.dialogService.open(ProductFormComponent, {
      data: {
        product: productToUpdate,
        mode: "edit"
      },
      header: 'Modifier le produit',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((product: Product) => {
      if (product) {
        this.ProductService.updateProduct(product).subscribe(products => {
          this.products = products;
          this.totalRecords = this.products.length;
          this.messageService.add({ severity: 'info', summary: 'Product modified', detail: product.name });
        });
      }
    });
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
