import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss'
})
export class ManageProductsComponent {

  products = [
    { name: 'Laptop', quantity: 10, price: '$1000' },
    { name: 'Smartphone', quantity: 25, price: '$800' },
    { name: 'Headphones', quantity: 50, price: '$100' },
    { name: 'Smartwatch', quantity: 15, price: '$200' },
    { name: 'Tablet', quantity: 30, price: '$600' },
  ];
}
