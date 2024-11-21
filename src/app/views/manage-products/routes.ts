import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./manage-products.component').then(m => m.ManageProductsComponent),
    data: {
      title: $localize `manage-product`
    }
  }
];

