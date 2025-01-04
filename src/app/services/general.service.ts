import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Register, Signin, adminRespond, file } from '../models/auth';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(public apiService: ApiService, private http: HttpClient) { }

  getToken() {
    let decrytedText = this.decryptText(sessionStorage.getItem('@RESL') ?? '')
    console.log('decrytedText',decrytedText )

    if(!decrytedText || decrytedText == '') return null;
    return JSON.parse(decrytedText);
  }

  login(data: Signin) {
    return this.apiService.post(`auth/admin`, data);
  }

  newSaveUser(user: any) {
    console.log('saveUser function', user)
      if(user.jwtToken) this.newSetToken(user);
  }

  newSetToken(user: any) {
    console.log('newSetToken', user)
    let storageData = {
        clientId: user.user._id,
        jwtToken: user.jwtToken
      }
    console.log('storageData', storageData)
    sessionStorage.setItem('@RESL', this.encryptText(JSON.stringify(storageData)));
}


encryptText(text: string): string {
  console.log('encryptingText',)
  const key = 'secret-key'; // Use an environment variable or secure source for the key
  return CryptoJS.AES.encrypt(text, key).toString();
}

decryptText(cipherText: string): string {
  console.log('DECryptingText', cipherText)

  const key = 'secret-key'; // Replace with a secure key
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}


  uploadFile(url: string, file: any, reqOpts?: any) {
  console.log('uploading', url, file)
  return this.http.put(url, file, reqOpts);
  }
  sendFile(data: file){
    return this.apiService.post(`files/upload`, data);
  }

  respondToRequest(id:string, data: adminRespond){
    return this.apiService.post(`admin/request/${id}`, data)
  }

  getAllRequest(){
    return this.apiService.get(`admin/request`);
  }

  getOneRequest(id:string){
    return this.apiService.get(`request/${id}`);
  }

}
