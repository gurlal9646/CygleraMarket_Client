import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private _http: HttpClient) {}

  async generateToken(data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/user/token`;
    try {
      const headers = new HttpHeaders().set('No-Auth', 'true');
      const response = await firstValueFrom(
        this._http.post(url, data, { headers })
      );
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }

  async forgotPassword(data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/user/password-reset`;
    try {
      const response = await firstValueFrom(
        this._http.post(url, data)
      );
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }
}
