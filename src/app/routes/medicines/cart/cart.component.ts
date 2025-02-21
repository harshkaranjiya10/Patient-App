import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../shared/ui/header/header.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import {MatIconModule} from '@angular/material/icon'
interface CartMedicine {
  dosage_type: string;
  medicine_type: string;
  image: string;
  medicine_id: string;
  schedule_type: string;
  cess_percentage: number;
  salt_content_id: string;
  mrp: number;
  packing_size: string;
  manufacturer_name: string;
  medicine_name: string;
  content: string;
  gst_percentage: number;
  size: number;
  price: number;
  available_for_patient: string;
  slug: string;
  discontinued: string;
  loose_quantity: number;
  sale_discount: number;
  strip_quantity: number;
  is_inventory_available: string;
  sell_in_loose: string;
  thumb_image: string;
  is_rx_required: number;
  packing: string;
  pack_size: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MatIconModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  cartItems: CartMedicine[] = this.cartService.getCartItems();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    
    this.cartItems = this.cartService.getCartItems();
    console.log(this.cartItems);
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
