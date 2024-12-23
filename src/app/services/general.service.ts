import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Register, Signin, adminRespond, file } from '../models/auth';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(public apiService: ApiService, private http: HttpClient) { }

  login(data: Signin) {
    return this.apiService.post(`auth/admin`, data);
  }

  uploadFile(data: file){
    return this.apiService.post(`auth/admin`, data);
  }

  respondToRequest(id:string, data: adminRespond){
    return this.apiService.post(`request/${id}`, data)
  }

  getAllRequest(){
    return this.apiService.get(`admin/request`);
  }

  getOneRequest(id:string){
    return this.apiService.get(`request/${id}`);
  }

}
