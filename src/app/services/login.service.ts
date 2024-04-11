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
    const url = `${environment.apiUrl}/user/sendPasswordResetLink`;
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

  async resetPassword(userId:string, token:string, data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/user/resetPassword/${userId}/${token}`;
    try {
      const response = await firstValueFrom(
        this._http.put(url, data)
      );
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }

  async validateOTP(data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/user/validateOTP`;
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

  async getUserDetails(): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/user/details`;
    try {
      const response = await firstValueFrom(
        this._http.get(url)
      );
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }

  async updateUserDetails(data:any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/user/details`;
    try {
      const response = await firstValueFrom(
        this._http.put(url,data)
      );
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }

  async changePassword(data:any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/user/changePassword`;
    try {
      const response = await firstValueFrom(
        this._http.post(url,data)
      );
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }

  async deleteAccount(): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/user/deleteAccount`;
    try {
      const response = await firstValueFrom(
        this._http.delete(url)
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
