import { Injectable } from '@angular/core';
import { environment } from '../environments/environment'; // 使用環境變數

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  loadGoogleMapsApi(): void {
    // 動態載入 Google Maps API 的腳本
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
    script.async = true;
    document.head.appendChild(script);
  }
}
