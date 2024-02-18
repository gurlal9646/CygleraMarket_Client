import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CygleraService {
  constructor(private _http: HttpClient) {}

  async getServices(): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/service/getServices`;
    try {
      const response = await firstValueFrom(this._http.get(url));
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }

  async getServiceById(id:string): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/service/getServices/${id}`;
    try {
      const response = await firstValueFrom(this._http.get(url));
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }

  async addService(data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/service/addService`;
    try {
      const response = await firstValueFrom(this._http.post(url, data));
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }
  async deleteService(id: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/service/deleteService/${id}`;
    try {
      const response = await firstValueFrom(this._http.delete(url));
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }
}
