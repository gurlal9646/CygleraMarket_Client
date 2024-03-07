import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProgramService {
  constructor(private _http: HttpClient) {}

  async getPrograms(): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/program/getPrograms`;
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

  async getProgramById(id:string): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/program/getPrograms/${id}`;
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

  async addProgram(data: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/program/addProgram`;
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
  async deleteProgram(id: any): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/program/deleteProgram/${id}`;
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
