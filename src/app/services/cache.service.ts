// cache.service.ts
import { Injectable } from '@angular/core';
import * as localForage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private storage: LocalForage;

  constructor() {
    this.storage = localForage.createInstance({
      name: 'locationApp'
    });
  }

  async setItem(key: string, value: any): Promise<void> {
    await this.storage.setItem(key, value);
  }

  async getItem(key: string): Promise<any> {
    return await this.storage.getItem(key);
  }

  async removeItem(key: string): Promise<void> {
    await this.storage.removeItem(key);
  }
}