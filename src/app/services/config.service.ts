// config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'assets/config.json'; // Adjust the path based on your project structure
  private config: any;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      this.config = await this.http.get(this.configUrl).toPromise();
    } catch (error) {
      console.error('Error loading config:', error);
      throw error;
    }
  }

  getConfig(): any {
    return this.config;
  }
}
