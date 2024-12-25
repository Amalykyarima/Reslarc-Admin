import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCheckComponent } from '@coreui/angular';
import { GeneralService } from 'src/app/services/general.service';
import { FormsModule } from '@angular/forms';
import { adminRespond } from 'src/app/models/auth';


@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormCheckComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  registrationForm: FormGroup;
  uploadedFile: File | null = null;
  requests:any;
  selectedRequest: any = null;
  notes: string = '';
  uploadedFiles: File[] = [];
  id: string = ""
  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
    ) {
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

  ngOnInit() {
    this.getRequests();
  }


  getRequests() {
    this.generalService.getAllRequest().subscribe((res: any) => {
      console.log('getRequests', res);
      if (res.statusCode === 200) {
        if (res.data.length > 0) {
          this.requests = res.data;
          console.log(res.data);
        } else {
          this.requests = []; // Ensure it's an empty array
          console.log('No requests found');
        }
      } else {
        this.requests = [];
        console.error(res.message);
      }
    });
  }

  goBack(): void {
    this.selectedRequest = null;
  }

  showRequestDetails(request: any): void {
    this.selectedRequest = request;
    this.id = this.selectedRequest._id;
    console.log('id', this.selectedRequest._id)
  }

  resetForm(): void {
    this.selectedRequest = null;
    this.notes = '';
    this.uploadedFile = null;
  }


onFileSelected(event: Event, index: number): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    // Add the file to the list
    this.uploadedFiles[index - 1] = file; // Index ensures we can track both upload slots
  }
}

sendResponse(): void {
  if (this.uploadedFiles.length === 0) {
    alert('Please upload at least one document before sending.');
    return;
  }
  // Add logic for handling the response submission
  console.log('Notes:', this.notes);
  console.log('Uploaded Files:', this.uploadedFiles);
  let data: adminRespond = new adminRespond();

  data = {
    ...data,
    adminNote: this.notes,
    files: this.uploadedFiles
  }
  this.generalService.respondToRequest(this.id, data).subscribe((res: any) => {
    console.log('respondToRequest', res);
    if (res.statusCode === 200) {
      console.log('200', res);
    } else {
      console.error(res.message);
    }
  });
}




}
