import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CustomHttpService {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, config = {}): Promise<T> {
    const response = await firstValueFrom(
      this.httpService.get<T>(url, config)
    );
    return response.data;
  }

  async post<T>(url: string, data: any, config = {}): Promise<T> {
    const response = await firstValueFrom(
      this.httpService.post<T>(url, data, config)
    );
    return response.data;
  }

  async put<T>(url: string, data: any, config = {}): Promise<T> {
    const response = await firstValueFrom(
      this.httpService.put<T>(url, data, config)
    );
    return response.data;
  }

  async delete<T>(url: string, config = {}): Promise<T> {
    const response = await firstValueFrom(
      this.httpService.delete<T>(url, config)
    );
    return response.data;
  }
}