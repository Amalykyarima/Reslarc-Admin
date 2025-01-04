import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCheckComponent } from '@coreui/angular';
import { GeneralService } from 'src/app/services/general.service';
import { FormsModule } from '@angular/forms';
import { adminRespond, file, } from 'src/app/models/auth';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormCheckComponent, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {
  registrationForm: FormGroup;
  uploadedFile: File | null = null;
  requests: any;
  selectedRequest: any = null;
  notes: string = '';
  uploadedFiles: File[] = [];
  id: string = ""
  file: string = "";
  uploadedFileDetails: any;
  UploadedDocuments: adminRespond = new adminRespond();
  userData: any;
  secure_url: string = "";
  url: string = "";

  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
    private http: HttpClient
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

  uploadFileToCloudinary(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset');
    formData.append('cloud_name', 'your_cloud_name');

    return this.http.post('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', formData).toPromise();
  }

  //   convertFileToDataURL(file: File): Promise<{ file: string }> {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();

  //     reader.onload = () => {
  //       const dataURL = reader.result as string;
  //       resolve({ file: dataURL });
  //     };

  //     reader.onerror = (error) => {
  //       reject(`Error reading file: ${error}`);
  //     };

  //     reader.readAsDataURL(file);
  //   });
  // }

  // onFileUpload(event: Event): void {
  //   const input = event.target as HTMLInputElement;

  //   if (input.files) {
  //     const files = Array.from(input.files); // Convert FileList to an array

  //     Promise.all(files.map((file) => this.convertFileToDataURL(file)))
  //       .then((results) => {
  //         console.log(results); // Logs an array of objects with data URLs
  //         this.file = results[0].file
  //         console.log('file', this.file)
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }

  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files = Array.from(input.files); // Convert FileList to an array

      Promise.all(files.map((file) => this.convertFileToDataURL(file)))
        .then((results) => {
          // Assign the Base64 string of the first file to `this.file`
          this.file = results[0].file;
          console.log('Base64 File:', this.file); // Logs the Base64 string of the file
        })
        .catch((error) => {
          console.error('Error converting file to Base64:', error);
        });
    }
  }

  convertFileToDataURL(file: File): Promise<{ file: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const dataURL = reader.result as string;
        resolve({ file: dataURL }); // Return the Base64 string in an object
      };

      reader.onerror = (error) => {
        reject(`Error reading file: ${error}`);
      };

      reader.readAsDataURL(file); // Read the file as a Data URL (Base64)
    });
  }



  // async sendResponse(): Promise<void> {

  //   let data1: file = new file();

  //   data1 = {
  //     ...data1,
  //     file : this.file
  // }

  //   await this.generalService.sendFile(data1).subscribe(
  //     (res: any) => {

  //      console.log('sendFile',res);

  //     this.userData = { ...res };

  //     // Initialize documents
  //     this.UploadedDocuments.files = { ...this.userData.UploadedDocuments.files };

  //       this.UploadedDocuments.files.secure_url = this.userData.UploadedDocuments.files.secure_url;
  //       this.UploadedDocuments.files.url = this.userData.UploadedDocuments.files.url ;




  //     },
  //     (err) => {
  //       console.error('Error calling respondToRequest:', err);
  //       alert('Failed to send response. Please try again.');
  //     }
  //   );

  //   let data: adminRespond = new adminRespond();

  //   data = {
  //     ...data,
  //     adminNote: this.notes,
  //     files: this.uploadedFileDetails.files,
  //   }

  //   await this.generalService.respondToRequest(this.id, data).subscribe(
  //     (res: any) => {
  //       console.log('respondToRequest response:', res);
  //       if (res.statusCode === 200) {
  //         alert('Response sent successfully!');
  //       } else {
  //         console.error('Error in response:', res.message);
  //       }
  //     },
  //     (err) => {
  //       console.error('Error calling respondToRequest:', err);
  //       alert('Failed to send response. Please try again.');
  //     }
  //   );
  // }


  async sendResponse(): Promise<void> {
    try {
      // Prepare the file data
      const data1: file = {
        file: this.file, // Assuming `this.file` contains the file data
      };

      // Call the first endpoint to send the file
      const res1: any = await this.generalService.sendFile(data1).toPromise();

      // Extract the secure and URL from the response
      this.secure_url = res1.secure_url;
      this.url = res1.url;
      console.log('Secure and url', this.secure_url, this.url )


      let data: adminRespond = new adminRespond();
      data = {
        ...data,
        adminNote: this.notes,
        files: [
          {
            name: 'file',
            secure_url: this.secure_url,
            url: this.url,
          },
        ], // `files` is now an array
      }

      console.log('data', this.id, data)

      // Call the second endpoint with the payload
      const res2: any = await this.generalService.respondToRequest(this.id, data).toPromise();
      if (res2.statusCode === 200){
        alert(res2.message);
      } else {
        alert(res2.message);
      }

      this.getRequests();

      // Handle the response from the second endpoint
      console.log('Response from second endpoint:', res2);

    } catch (error) {
      // Handle errors for both endpoints
      console.error('Error during the process:', error);
    }
  }



}
