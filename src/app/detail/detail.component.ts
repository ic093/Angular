import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { ThModule, RowsModule, RowstationsModule } from '../weather.module'; //try WeatherModule
import { delay, finalize } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  th: ThModule[] = [];
  rows: RowsModule[] = [];
  headerstations: ThModule[] = [];
  rowstations: RowstationsModule[] = [];

  public Loading: boolean = true; //loading
  public cityStationCount: { city: string; count: number }[] = [];
  public stationCount: number = 0; //氣象站總數
  public averageTemperature: number = 0; //平均溫度
  public averageWindSpeed: number = 0; //平均風速
  public temperature: {
    //最高溫度、最低溫度
    maxTemperature: {
      temperature: number;
      countyName: string;
      obsTime: string;
    };
    lowTemperature: {
      temperature: number;
      countyName: string;
      obsTime: string;
    };
  } = {
    maxTemperature: {
      temperature: 0,
      countyName: '',
      obsTime: '',
    },
    lowTemperature: {
      temperature: 0,
      countyName: '',
      obsTime: '',
    },
  };
  public windSpeed: {
    maxWindSpeed: {
      windSpeed: number;
      countyName: string;
      obsTime: string;
    };
    lowWindSpeed: {
      windSpeed: number;
      countyName: string;
      obsTime: string;
    };
  } = {
    maxWindSpeed: {
      windSpeed: 0,
      countyName: '',
      obsTime: '',
    },
    lowWindSpeed: {
      windSpeed: 0,
      countyName: '',
      obsTime: '',
    },
  };

  constructor(public WeatherService: WeatherService) {}

  async ngOnInit(): Promise<void> {
    this.Loading = true; //loading畫面

    //平均溫度
    this.WeatherService.getAverageTemperature().subscribe({
      next: (temp) => {
        this.averageTemperature = temp;
        console.log('當前平均溫度', this.averageTemperature);
        this.updateWeather();
      },
      error: (err) => {
        console.log('err', err);
      },
    });
    //平均風速
    this.WeatherService.getAverageWindSpeed().subscribe({
      next: (speed) => {
        this.averageWindSpeed = speed;
        console.log('當前平均風速', this.averageWindSpeed);
        this.updateWeather();
      },
      error: (err) => {
        console.log('err', err);
      },
    });
    //最高溫度及縣市
    this.WeatherService.getMaxTemperature().subscribe({
      next: (maxTem) => {
        this.temperature = maxTem;
        console.log(this.temperature);
        this.updateWeather();
      },
      error: (err) => {
        console.log('err', err);
      },
    });
    //最高風速及縣市
    this.WeatherService.getMaxWindSpeed().subscribe({
      next: (maxSpeed) => {
        this.windSpeed = maxSpeed;
        console.log(this.windSpeed);
        this.updateWeather();
      },
      error: (err) => {
        console.log('err', err);
      },
    });
    //各縣市氣象站數
    this.WeatherService.getCityStationCount().subscribe({
      next: (count) => {
        this.cityStationCount = count;
        console.log('各縣市氣象站數', this.cityStationCount);
        this.updateWeather();
      },
      error: (err) => {
        console.log('err', err);
      },
    });
    //氣象站總數
    this.WeatherService.getAllStationCount().subscribe({
      next: (count) => {
        this.stationCount = count;
        console.log('氣象站總數', this.stationCount);
        this.updateWeather();
      },
    });
  }
  updateWeather(): void {
    this.th = [
      {
        text: '當前平均溫度',
        value: this.averageTemperature,
        colspan: 2,
        backgroundColor: '#ff8c00',
      },
      {
        text: '當前平均風速',
        value: this.averageWindSpeed,
        colspan: 2,
        backgroundColor: 'rgb(135, 206, 235)',
      },
    ];
    this.rows = [
      {
        type: '',
        data: ['最高溫度', '最低溫度', '最高風速', '最低風速'],
      },
      {
        type: '縣市',
        data: [
          `${this.temperature.maxTemperature.countyName || '無資料'} (${
            this.temperature.maxTemperature.temperature || '無資料'
          }°C)`,
          `${this.temperature.lowTemperature.countyName || '無資料'} (${
            this.temperature.lowTemperature.temperature || '無資料'
          }°C)`,
          `${this.windSpeed.maxWindSpeed.countyName || '無資料'} (${
            this.windSpeed.maxWindSpeed.windSpeed || '無資料'
          }m/s)`,
          `${this.windSpeed.lowWindSpeed.countyName || '無資料'} (${
            this.windSpeed.lowWindSpeed.windSpeed || '無資料'
          }m/s)`,
        ],
      },
      {
        type: '監測時間',
        data: [
          `${this.temperature.maxTemperature.obsTime || '無資料'}`,
          `${this.temperature.lowTemperature.obsTime || '無資料'}`,
          `${this.windSpeed.maxWindSpeed.obsTime || '無資料'}`,
          `${this.windSpeed.lowWindSpeed.obsTime || '無資料'}`,
        ],
      },
    ];
    this.headerstations = [
      {
        text: '氣象總數:',
        value: this.stationCount,
        colspan: 3,
        backgroundColor: 'rgb(176, 196, 222)',
      },
    ];
    this.rowstations = [{ city: '縣市', count: '氣象站' }];
    for (let i = 0; i < this.cityStationCount.length; i++) {
      const item = this.cityStationCount[i];
      this.rowstations.push({
        city: item.city,
        count: item.count.toString(),
      });
    }
  }
}
