export class Product {
  id: number;
  code: string;
  name: string;
  description: string;
  image?: string = null;
  price: number;
  category: string;
  quantity: number;
  inventoryStatus: string;
  rating?: number = null;

  constructor() {
    this.id = null;
    this.code = null;
    this.name = "";
    this.description = "";
    this.price = null;
    this.category = null;
    this.quantity = 0;
    this.inventoryStatus = "OUTOFSTOCK";
  }
}