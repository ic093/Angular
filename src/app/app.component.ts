import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { firstValueFrom } from 'rxjs';
import { GoogleMapsService } from './google-map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'project';

  constructor(
    private weatherService: WeatherService,
    private googleMapsService: GoogleMapsService
  ) {}

  async ngOnInit() {
    // 動態載入 Google Maps API
    this.googleMapsService.loadGoogleMapsApi();
    try {
      const data = await firstValueFrom(this.weatherService.getApiData());
      console.log('API data:', data);
    } catch (err) {
      console.error('Error fetching API data:', err);
    }
  }
}
