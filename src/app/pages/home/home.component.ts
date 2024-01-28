import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';
import { StoreService } from '../../services/store.service';

const ROWS_HEIGHT: {[id:number]: number} = {1: 400, 3: 335, 4: 350}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols]
  category: string | undefined;
  products: Array<Product>| undefined;
  sort = 'desc';
  count = 12;
  productsSubscription: Subscription | undefined;
  screenWidth: any;

  constructor(private cartService: CartService, private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.getProducts();
    this.screenWidth = window.innerWidth;
  }
  
  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1080) {
      this.cols = 3;
    }
    if (this.screenWidth < 925) {
      this.cols = 1;
    }
  }

  getProducts(): void {
    this.products = undefined;
    this.productsSubscription =  this.storeService.getAllProducts(this.count, this.sort, this.category)
    .subscribe((_products) => this.products = _products);
    this.onWindowResize();
  }

  onColumnsCountChange(colsNumber: number): void {
    this.cols = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.cols]
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id
    })
  }
  onItemsCountChange(newCount: number): void {
    this.count = newCount
    this.getProducts();
   }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }
  
  ngOnDestroy(): void {
     if(this.productsSubscription) {
      this.productsSubscription.unsubscribe();
     }
   }
}
