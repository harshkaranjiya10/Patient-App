import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/ui/header/header.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';


interface CartMedicine {
  medicine_id: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems: CartMedicine[] = this.cartService.getCartItems();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.getCartItems();
  }
  total =  this.cartService.calculateTotal();
  
  decrementQuantity(item: CartMedicine) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCartItems(this.cartItems);
      this.calculateTotal();
    }
  }

  incrementQuantity(item: CartMedicine) {
    item.quantity++;
    this.cartService.updateCartItems(this.cartItems);
    this.calculateTotal();
  }

  removeItem(item: CartMedicine) {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.cartService.updateCartItems(this.cartItems);
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.total = +this.cartService.calculateTotal().toFixed(2);
    console.log(this.total);
  }
}
