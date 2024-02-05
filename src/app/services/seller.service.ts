import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  constructor(private _http: HttpClient) { }

  async register(data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/buyer/register`;;
    try {
      const response = await firstValueFrom(this._http.post(url, data));
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subCode = 0;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }
}