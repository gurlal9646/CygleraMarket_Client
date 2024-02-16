import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const url = `${environment.apiUrl}/seller/register`;;
    try {
      const headers = new HttpHeaders().set('No-Auth', 'true');
      const response = await firstValueFrom(
        this._http.post(url, data, { headers })
      );      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }
}
