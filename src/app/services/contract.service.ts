import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/ApiResponse';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  constructor(private _http: HttpClient) {}

  async getContracts(): Promise<ApiResponse> {
    const url = `${environment.apiUrl}/contract/getContracts`;
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
