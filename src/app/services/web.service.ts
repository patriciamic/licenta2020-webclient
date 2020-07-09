import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WebService {

  baseUrl = 'http://192.168.0.105:3000';


  constructor(private http: HttpClient) { }


  public get(url: string) {
    return this.http.get(`${this.baseUrl}${url}`);
  }

  public post(url: string, dataToSend: any) {
    return this.http.post(`${this.baseUrl}${url}`, dataToSend);
  }

}
