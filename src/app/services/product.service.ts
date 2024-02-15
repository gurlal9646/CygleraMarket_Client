import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private _http: HttpClient) {}

  async getProducts(): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/product/getProducts`;
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

  async addProduct(data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/product/addProduct`;
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
  async deleteProduct(id: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/product/deleteProduct/${id}`;
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
