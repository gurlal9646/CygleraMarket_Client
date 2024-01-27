import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }

  async generateToken(data: any): Promise<ApiResponse> {
    const url = environment.apiUrl;
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
