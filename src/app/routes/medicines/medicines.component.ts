import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../shared/ui/header/header.component';
import { Medicine, MedicinesService } from '../../services/medicines.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

import {MatSnackBar} from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectChange} from '@angular/material/select';


export interface CartMedicine {
  medicine_id: string;
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-medicines',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MatSlideToggleModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './medicines.component.html',
  styleUrl: './medicines.component.css',
})
export class MedicinesComponent {
  Medicines = new BehaviorSubject<Medicine[]>([]);
  oldMedicines:  Medicine[] = [];
  searchString: string = '';
  constructor(private medicinesService: MedicinesService, private router: Router, private authService: AuthService, private cartService: CartService) {
    this.oldMedicines = [...this.Medicines.value];
    this.filteredMedicines = this.oldMedicines;
  }
  error = '';
  cartMedicines: CartMedicine[] = [];

  dosage_typeInput: string = '';

  filteredMedicines: Medicine[] = [];
  dosage_type = '';
  available = '';
  
  onSearch(searchValue: any) {
    this.error = '';
    this.medicinesService
      .postSearchMedicine({
        apikey: 'I8JElvKBFFg8rMpOteYljU7w5nqH5dKP',
        searchstring: searchValue.value,
      })
      .subscribe((res) => {
        if (res.status_code === '1') {
          this.Medicines.next(res.data.result);
          this.oldMedicines = this.Medicines.value;
          this.filteredMedicines = this.Medicines.value;
          console.log(this.Medicines);
        } else {
          this.error = res.status_message
        }
      });
  }
  private _snackBar = inject(MatSnackBar);

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Close', {
      duration: 5000,
    });
  }

  addToCart(medicine: Medicine) {
    console.log('Adding to cart:', medicine);

    const existingMedicine = this.cartService.getCartItems().find(
      (p) => p.medicine_id === medicine.medicine_id
    );

    if (existingMedicine) {
      //console.log(existingMedicine);
      this.openSnackBar('Medicine already added');
    } else {
      this.openSnackBar('Medicine added to cart');
      const cartItem: CartMedicine = {
        medicine_id: medicine.medicine_id,
        name: medicine.medicine_name,
        price: medicine.mrp, 
        quantity: 1,
      };
      this.cartMedicines.push(cartItem);
      
      this.cartService.addCartItem(cartItem);
    }
    //localStorage.setItem('cart', JSON.stringify(this.cartMedicines))

    console.log('Cart:', this.cartMedicines);
  }

  onCart() {
    console.log(this.cartMedicines);
    if (this.authService.authenticated) {
      this.router.navigate(['medicines', 'cart']);
    } else {
      this.router.navigate(['login']);
    }
  }




  onChange(event: MatSelectChange) {
    if (event?.value) {
      this.dosage_type = event.value;
      this.applyFilters();
    }
  }


  onAvailable() {
    this.available = 'yes';
    if(this.available === 'yes') {
      this.applyFilters();
    } else {
      this.available = '';
      return ;
    }
    this.applyFilters();
  }

  applyFilters() {
    this.filteredMedicines = this.oldMedicines.filter(medicine => {
      return (
        (this.dosage_type ? medicine.dosage_type === this.dosage_type : true) &&
        (this.available ? medicine.is_inventory_available === 'yes' : true)
      );
    });

    this.Medicines.next(this.filteredMedicines);
  }

  onReload() {
    this.dosage_type = '';
    this.available = '';
    this.filteredMedicines = [...this.oldMedicines];
    this.Medicines.next(this.oldMedicines);
  }

}
