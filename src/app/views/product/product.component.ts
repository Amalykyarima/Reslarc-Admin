import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCheckComponent } from '@coreui/angular';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [FormCheckComponent, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  registrationForm: FormGroup;
  uploadedFile: File | null = null;

  constructor(
    private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      organization: [''],
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      const formData = new FormData();
      formData.append('name', this.registrationForm.value.name);
      formData.append('email', this.registrationForm.value.email);
      formData.append('phone', this.registrationForm.value.phone);
      formData.append('organization', this.registrationForm.value.organization);

      if (this.uploadedFile) {
        formData.append('idCard', this.uploadedFile);
      }

      console.log('Form submitted!', formData);
      // Add API call here to submit formData to your backend
    } else {
      console.error('Form is invalid');
    }
  }
}
