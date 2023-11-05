import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'app/models/product.model';
import { ProductsService } from 'app/services/products.service';
import { ConfirmEventType, ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from './product-form/product-form.component';
import { switchMap, tap } from 'rxjs';

interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  filterType?: string;
}
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

  cols!: Column[];
  _selectedColumns!: Column[];

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

    this.cols = [
      { field: 'name', header: 'Name', sortable: true, filterType: 'text' },
      { field: 'description', header: 'Description', sortable: true,  filterType: 'text' },
      { field: 'image', header: 'Image' },
      { field: 'category', header: 'Category', sortable: true, filterType: 'text' },
      { field: 'quantity', header: 'Quantity', sortable: true,  filterType: 'numeric' }
    ];

    this._selectedColumns = this.cols;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
      //restore original order
      this._selectedColumns = this.cols.filter((col) => val.includes(col));
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
      header: 'New product',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((product: Product) => {
      if (product) {
        this.ProductService.addProduct(product).subscribe(newProduct => {
          console.log('new product: ', newProduct);
          this.messageService.add({ severity: 'info', summary: 'New product saved', detail: newProduct.name });
          this.products.push(newProduct);
          this.totalRecords = this.products.length;
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
      header: 'Modify product',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      maximizable: true
    });

    this.ref.onClose.subscribe((product: Product) => {
      if (product) {
        this.ProductService.updateProduct(product).subscribe(productUpdated => {
          let idx = this.products.findIndex(product => product.id = productUpdated.id);
          this.products[idx] = productUpdated;

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
        this.ProductService.deleteProduct(product.id).subscribe({
          next: function(){
            this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: "Product " + product.name + " deleted" });

            this.deleteProductFromData(product);
          },
          error: function(err: any) {
            console.error(err);
            // voir si y'a aussi "complete: function()"
          }
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
        this.ProductService.deleteMultipleProducts(this.selectedProducts).subscribe(productsDeleted => {
          this.selectedProducts.forEach(prod => {
            this.deleteProductFromData(prod);
          })

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

  private deleteProductFromData(product: Product): void {
    let idx: number = this.products.findIndex((p) => p.id === product.id);
    this.products.splice(idx, 1);
    this.totalRecords = this.products.length;
  }
}
