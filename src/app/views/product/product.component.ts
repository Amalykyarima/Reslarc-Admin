import { Component } from '@angular/core';
import { FormCheckComponent } from '@coreui/angular';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormCheckComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

}
