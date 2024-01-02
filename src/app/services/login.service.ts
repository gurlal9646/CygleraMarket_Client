import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  async postData(data: any): Promise<any> {
    try {
      const config = this.configService.getConfig();
      const response = await this.http
        .post(`${config?.apiUrl}/login`, data)
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
