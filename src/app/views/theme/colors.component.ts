import { AfterViewInit, Component, HostBinding, Inject, Input, OnInit, Renderer2, forwardRef } from '@angular/core';
import { CommonModule, DOCUMENT, NgClass } from '@angular/common';

import { getStyle, rgbToHex } from '@coreui/utils';
import { TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent, ColComponent } from '@coreui/angular';

@Component({
    templateUrl: 'colors.component.html',
    styleUrl: './colors.component.scss',
    standalone: true,
    imports: [TextColorDirective, CommonModule, CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent, forwardRef(() => ThemeColorComponent)]
})
export class ColorsComponent implements OnInit, AfterViewInit {

  orders = [
    {
      userName: 'John Doe',
      userStatus: 'New | Registered: Jan 1, 2021',
      userImage: 'assets/images/user1.jpg',
      countryFlag: 'assets/images/usa.png',
      orderStatus: 'Completed',
      statusColor: 'completed',
      amount: '$120',
      paymentMethod: 'assets/images/mastercard.png',
      orderDate: 'Nov 21, 2024',
    },
    {
      userName: 'Jane Smith',
      userStatus: 'Recurring | Registered: Feb 10, 2021',
      userImage: 'assets/images/user2.jpg',
      countryFlag: 'assets/images/brazil.png',
      orderStatus: 'Pending',
      statusColor: 'pending',
      amount: '$200',
      paymentMethod: 'assets/images/visa.png',
      orderDate: 'Nov 20, 2024',
    },
    {
      userName: 'Alice Brown',
      userStatus: 'VIP | Registered: Mar 15, 2021',
      userImage: 'assets/images/user3.jpg',
      countryFlag: 'assets/images/uk.png',
      orderStatus: 'Cancelled',
      statusColor: 'cancelled',
      amount: '$300',
      paymentMethod: 'assets/images/paypal.png',
      orderDate: 'Nov 19, 2024',
    },
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
  }

  public themeColors(): void {
    Array.from(this.document.querySelectorAll('.theme-color')).forEach(
      (element: Element) => {
        const htmlElement = element as HTMLElement;
        const background = getStyle('background-color', htmlElement) ?? '#fff';
        const table = this.renderer.createElement('table');
        table.innerHTML = `
          <table class="table w-100">
            <tr>
              <td class="text-muted">HEX:</td>
              <td class="font-weight-bold">${rgbToHex(background)}</td>
            </tr>
            <tr>
              <td class="text-muted">RGB:</td>
              <td class="font-weight-bold">${background}</td>
            </tr>
          </table>
        `;
        this.renderer.appendChild(htmlElement.parentNode, table);
        // @ts-ignore
        // el.parentNode.appendChild(table);
      }
    );
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.themeColors();
  }
}

@Component({
    selector: 'app-theme-color',
    template: `
    <c-col xl="2" md="4" sm="6" xs="12" class="my-4 ms-4">
      <div [ngClass]="colorClasses" style="padding-top: 75%;"></div>
      <ng-content></ng-content>
    </c-col>

  `,
    styleUrl: './colors.component.scss',
    standalone: true,
    imports: [ColComponent, NgClass],
})
export class ThemeColorComponent implements OnInit {
  @Input() color = '';
  public colorClasses = {
    'theme-color w-75 rounded mb-3': true
  };

  @HostBinding('style.display') display = 'contents';

  ngOnInit(): void {
    this.colorClasses = {
      ...this.colorClasses,
      [`bg-${this.color}`]: !!this.color
    };
  }



}

