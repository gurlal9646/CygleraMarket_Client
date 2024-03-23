import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestForApprovalService {
  constructor(private _http: HttpClient) {}

  async getRequestforapprovals(): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/rfa/getRequestforapprovals`;
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

  async addRequest(data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/rfa/addRequest`;
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

  async updateRequestStatus(requestId:any,data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/rfa/addRequest/${requestId}`;
    try {
      const response = await firstValueFrom(this._http.put(url, data));
      return response as ApiResponse;
    } catch (error) {
      const res = new ApiResponse();
      res.subcode = 100;
      res.message = 'An error occurred';
      return Promise.reject(res);
    }
  }

  async addConversation(data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/rfa/addConversation`;
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

  async getConversation(requestId:any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/rfa/getConversation/${requestId}`;
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




}
