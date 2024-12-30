import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCheckComponent } from '@coreui/angular';
import { GeneralService } from 'src/app/services/general.service';
import { FormsModule } from '@angular/forms';
import { adminRespond, file } from 'src/app/models/auth';
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



  async sendResponse(): Promise<void> {
    // if (this.uploadedFiles.length === 0) {
    //   alert('Please upload at least one document before sending.');
    //   return;
    // }

    let data1: file = new file();

    data1 = {
      ...data1,
      file : this.file
  }

    await this.generalService.sendFile(data1).subscribe(
      (res: any) => {
       console.log('sendFile',res);
       this.uploadedFileDetails = res.data
      },
      (err) => {
        console.error('Error calling respondToRequest:', err);
        alert('Failed to send response. Please try again.');
      }
    );


    // const uploadedFileDetails: any[] = [];
    // // Upload each file to Cloudinary
    // try {
    //   for (const file of this.uploadedFiles) {
    //     const uploadResponse = await this.uploadFileToCloudinary(file);
    //     uploadedFileDetails.push({
    //       name: file.name,
    //       secure_url: uploadResponse.secure_url,
    //       url: uploadResponse.url,
    //     });
    //   }
    // } catch (error) {
    //   console.error('Error uploading files to Cloudinary:', error);
    //   alert('Error uploading files. Please try again.');
    //   return;
    // }

    // // Construct payload
    // const data = {
    //   adminNote: this.notes,
    //   files: this.uploadedFileDetails,
    // };

    // // Send response
    // await this.generalService.respondToRequest(this.id, data).subscribe(
    //   (res: any) => {
    //     console.log('respondToRequest response:', res);
    //     if (res.statusCode === 200) {
    //       alert('Response sent successfully!');
    //     } else {
    //       console.error('Error in response:', res.message);
    //     }
    //   },
    //   (err) => {
    //     console.error('Error calling respondToRequest:', err);
    //     alert('Failed to send response. Please try again.');
    //   }
    // );
  }

  // sendResponse(): void {
  //   if (this.uploadedFiles.length === 0) {
  //     alert('Please upload at least one document before sending.');
  //     return;
  //   }
  //   // Add logic for handling the response submission
  //   console.log('Notes:', this.notes);
  //   console.log('Uploaded Files:', this.uploadedFiles);
  //   let data: adminRespond = new adminRespond();

  //   data = {
  //     ...data,
  //     adminNote: this.notes,
  //     files: this.uploadedFiles
  //   }
  //   this.generalService.respondToRequest(this.id, data).subscribe((res: any) => {
  //     console.log('respondToRequest', res);
  //     if (res.statusCode === 200) {
  //       console.log('200', res);
  //     } else {
  //       console.error(res.message);
  //     }
  //   });
  // }




}
