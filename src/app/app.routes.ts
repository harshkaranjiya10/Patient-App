import { Routes } from '@angular/router';
import { LoginComponent } from './routes/auth/login/login.component';
import { AuthGuard } from './routes/auth/auth.guard';
import { InventoryComponent } from './routes/medicines/inventory/inventory.component';
import { MedicinesComponent } from './routes/medicines/medicines.component';
import { CartComponent } from './routes/medicines/cart/cart.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: "login",
        pathMatch: "full"
    },
    {
        path: 'login',
        component: LoginComponent
    }, 
    {
        path: 'medicines/get-inventory-items',
        component: InventoryComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'medicines',
        component: MedicinesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'medicines/cart',
        component: CartComponent,
        canActivate: [AuthGuard]

    },
    {
        path: '**',
        redirectTo: '/login',
        pathMatch: 'full'
    }
];
