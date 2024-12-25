import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { GeneralService } from '../../../../../src/app/services/general.service'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule, ContainerComponent, ReactiveFormsModule, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle]
})
export class LoginComponent {
  loginForm: FormGroup;
  processLoading: boolean = false;

  constructor( private fb: FormBuilder,  private generalService: GeneralService,
    private router: Router) {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
      });
     }


  login(): void {
  const { email, password } = this.loginForm.value;
    console.log('email:', email);
    console.log('Password:', password);
    this.processLoading = true;
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Form Submitted Successfully:', formData);
      this.generalService.login(formData).subscribe((res: any) => {
        console.log('onSubmit',res);
        if (res.statusCode === 202) {
          if (res.data && res.data.jwtToken) {
            this.generalService.newSaveUser(res.data);
          }
          alert(res.message);
          this.loginForm.reset();
          this.router.navigateByUrl('/dashboard')
        } else{
          this.processLoading = false;
          alert(res.message);
        }
      })

    } else {
      console.error('Form is invalid');
    }
  }

}
