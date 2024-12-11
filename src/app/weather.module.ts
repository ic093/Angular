// import { RowstationsModule } from './weather.module';
import { routes } from './app.routes';
export interface ThModule {
  text: string;
  value: number;
  colspan: number;
  backgroundColor: string;
}
export interface RowsModule {
  type: string;
  data: string[];
}

export interface RowstationsModule {
  city: string;
  count: string;
}
//最高溫度
export interface maxTemperature {
  temperature: number;
  countyName: string;
  obsTime: string;
}
//最低溫度
export interface lowTemperature {
  temperature: number;
  countyName: string;
  obsTime: string;
}
// 定義最高風速資料結構
export interface MaxWindSpeed {
  windSpeed: number;
  countyName: string;
  obsTime: string;
}

// 定義最低風速資料結構
export interface LowWindSpeed {
  windSpeed: number;
  countyName: string;
  obsTime: string;
}
