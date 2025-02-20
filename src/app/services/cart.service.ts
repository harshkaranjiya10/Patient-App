import { Injectable } from '@angular/core';
import { CartMedicine } from '../routes/medicines/medicines.component';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartMedicine[] = this.getCartItems();

  getCartItems(): CartMedicine[] {
    const storedCartItems = localStorage.getItem('cartItems');
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  }

  addCartItem(item: CartMedicine) {
    const cartItems = this.getCartItems();
    cartItems.push(item);
    this.saveCartItems(cartItems);
  }

  removeCartItem(item: CartMedicine) {
    const cartItems = this.getCartItems();
    const index = cartItems.indexOf(item);
    if (index !== -1) {
      cartItems.splice(index, 1);
    }
    this.saveCartItems(cartItems);
  }

  updateCartItems(cartItems: CartMedicine[]) {
    this.saveCartItems(cartItems);
  }

  private saveCartItems(cartItems: CartMedicine[]) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  calculateTotal(): number {
    const cartItems = this.getCartItems();
    let total = 0;
    cartItems.forEach(item => {
      total += item.price * item.quantity;
    }); 
    return total;
  }
}