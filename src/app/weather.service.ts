import { importProvidersFrom, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, max } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { delay, finalize } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  public weatherUrl =
    'https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?Authorization=CWA-938A3468-9410-4112-8B54-6D82482F5371';

  constructor(public http: HttpClient, public datePipe: DatePipe) {}
  private apiDataSubject = new BehaviorSubject<any>(null);
  public apiData = this.apiDataSubject.asObservable();
  getApiData(): Observable<any> {
    console.log('call api');
    const data = this.http.get<any>(this.weatherUrl).pipe(
      //loading畫面
      delay(300),
      finalize(() => {
        document
          .querySelector('.loader-container')
          ?.classList.add('loader-hide');
      })
    );
    this.apiData = data;
    return data;
  }
  //平均溫度
  getAverageTemperature(): Observable<number> {
    return this.apiData.pipe(
      map((data) => {
        const stations = data.records.Station;
        // 取 AirTemperature
        const temperatures: number[] = stations
          .map((station: any) => {
            const airTemperature = station.WeatherElement.AirTemperature;
            if (airTemperature) {
              return parseFloat(airTemperature);
            } else {
              return undefined;
            }
          })
          .filter((tem: number) => !isNaN(tem) && tem >= 0); //過濾
        if (temperatures.length === 0) {
          console.log('無有效溫度數據');
          return 0;
        }
        let sum = 0;
        for (let i = 0; i < temperatures.length; i++) {
          sum += temperatures[i];
        }

        return Number((sum / temperatures.length).toFixed(1)); //平均溫度
      })
    );
  }
  //平均風速
  getAverageWindSpeed(): Observable<number> {
    return this.apiData.pipe(
      map((data) => {
        const stations = data.records.Station;
        const windSpeeds: number[] = stations
          .map((station: any) => {
            const windSpeed = station.WeatherElement.WindSpeed;
            return windSpeed ? windSpeed : NaN;
          })
          .filter((speed: number) => !isNaN(speed) && speed >= 0); // 過濾掉無效或負值的風速
        if (windSpeeds.length === 0) {
          console.log('無有效風速數據');
          return 0;
        }
        let sum = 0;
        for (let i = 0; i < windSpeeds.length; i++) {
          sum += windSpeeds[i];
        }
        return Number((sum / windSpeeds.length).toFixed(0)); //平均風速
      })
    );
  }
  //最高溫度的縣市、觀測時間
  getMaxTemperature(): Observable<{
    maxTemperature: {
      //最高溫
      temperature: number;
      countyName: string;
      obsTime: string;
    };
    lowTemperature: {
      //最低溫
      temperature: number;
      countyName: string;
      obsTime: string;
    };
  }> {
    return this.apiData.pipe(
      map((data) => {
        const stations = data.records.Station;
        // console.log('所有測站:', stations);
        if (!stations || stations.length === 0) {
          return {
            maxTemperature: {
              temperature: 0,
              countyName: '無資料',
              obsTime: '無資料',
            },
            lowTemperature: {
              temperature: 0,
              countyName: '無資料',
              obsTime: '無資料',
            },
          };
        }
        const allStations = stations
          .map((station: any) => {
            //allStations裡面有1.maxTemperature(溫度)和2.county(縣市)
            const temperature = station.WeatherElement.AirTemperature; //提取溫度
            const county = station.GeoInfo.CountyName; //縣市名稱
            const obsTime = station.ObsTime.DateTime; //觀測時間
            // console.log('溫度', maxTemperature);
            // console.log('縣市', county);
            // console.log('時間', obsTime);
            //轉換時間格式
            const tranObsTime = this.datePipe.transform(
              obsTime,
              'yyyy-MM-dd HH:mm:ss'
            );
            if (temperature && county && obsTime) {
              return {
                temperature: temperature, //溫度
                countyName: county, //城市
                obsTime: tranObsTime, //監測時間
              };
            }
            return null;
          })
          .filter(
            (station: any) =>
              station !== null &&
              !isNaN(station.temperature) &&
              station.temperature > -99
          );
        if (allStations.length === 0) {
          console.log('無有效溫度數據');
          return {
            maxTemperature: {
              temperature: 0,
              countyName: '無資料',
              obsTime: '無資料',
            },
            lowTemperature: {
              temperature: 0,
              countyName: '無資料',
              obsTime: '無資料',
            },
          };
        }
        //找出最高溫;
        let maxTempLocation = {
          temperature: 0,
          countyName: '',
          obsTime: '',
        };
        for (let station of allStations) {
          if (station.temperature > maxTempLocation.temperature) {
            maxTempLocation = station;
          }
        }
        //找出最低溫
        let lowTempLocation = {
          temperature: Infinity,
          countyName: '',
          obsTime: '',
        };
        for (let station of allStations) {
          if (
            station.temperature < lowTempLocation.temperature &&
            station.temperature !== -99
          ) {
            lowTempLocation = station;
          }
        }
        // console.log('最高溫:', maxTempLocation);
        // console.log('最低溫:', lowTempLocation);
        return {
          maxTemperature: maxTempLocation,
          lowTemperature: lowTempLocation,
        }; // 返回最高溫及其對應的縣市
      })
    );
  }
  //最高風速的縣市、觀測時間
  getMaxWindSpeed(): Observable<{
    maxWindSpeed: {
      // 最高風速
      windSpeed: number;
      countyName: string;
      obsTime: string;
    };
    lowWindSpeed: {
      // 最低風速
      windSpeed: number;
      countyName: string;
      obsTime: string;
    };
  }> {
    return this.apiData.pipe(
      map((data) => {
        const stations = data.records.Station;
        if (!stations || stations.length === 0) {
          return {
            maxWindSpeed: {
              windSpeed: 0,
              countyName: '無資料',
              obsTime: '無資料',
            },
            lowWindSpeed: {
              windSpeed: 0,
              countyName: '無資料',
              obsTime: '無資料',
            },
          };
        }
        // 過濾出有效數據
        const allStations = stations
          .map((station: any) => {
            const windSpeed = station.WeatherElement.WindSpeed;
            const county = station.GeoInfo.CountyName;
            const obsTime = station.ObsTime.DateTime;
            const tranObsTime = this.datePipe.transform(
              obsTime,
              'yyyy-MM-dd HH:mm:ss'
            );
            if (windSpeed && county && obsTime) {
              return {
                windSpeed: windSpeed,
                countyName: county,
                obsTime: tranObsTime,
              };
            }
            return null; // 無效數據返回 null
          })
          .filter(
            (station: any) =>
              station !== null &&
              !isNaN(station.windSpeed) &&
              station.windSpeed > -99
          );
        if (allStations.length === 0) {
          return {
            maxWindSpeed: {
              windSpeed: 0,
              countyName: '無資料',
              obsTime: '無資料',
            },
            lowWindSpeed: {
              windSpeed: 0,
              countyName: '無資料',
              obsTime: '無資料',
            },
          };
        }
        // 找出最高風速
        let maxWindSpeedLocation = {
          windSpeed: -Infinity,
          countyName: '',
          obsTime: '',
        };
        for (let station of allStations) {
          if (station.windSpeed > maxWindSpeedLocation.windSpeed) {
            maxWindSpeedLocation = station;
          }
        }
        // 找出最低風速
        let lowWindSpeedLocation = {
          windSpeed: Infinity,
          countyName: '',
          obsTime: '',
        };
        for (let station of allStations) {
          if (station.windSpeed < lowWindSpeedLocation.windSpeed) {
            lowWindSpeedLocation = station;
          }
        }
        // console.log('最高風速:', maxWindSpeedLocation);
        // console.log('最低風速:', lowWindSpeedLocation);
        return {
          maxWindSpeed: maxWindSpeedLocation,
          lowWindSpeed: lowWindSpeedLocation,
        };
      })
    );
  }
  //氣象站總數
  getAllStationCount(): Observable<number> {
    return this.apiData.pipe(
      map((data) => {
        const stations = data.records.Station;
        const stationCount = stations.length;
        // console.log('氣象站總數:', stationCount);
        return stationCount;
      })
    );
  }
  getCityStationCount(): Observable<{ city: string; count: number }[]> {
    return this.apiData.pipe(
      map((data) => {
        const stations = data.records.Station;
        if (stations.length === 0) {
          console.log('無資料');
          return [];
        }
        //計算各縣市的氣象站數量
        const cityCount: { [city: string]: number } = {};
        for (let i = 0; i < stations.length; i++) {
          const station = stations[i];
          const city = station.GeoInfo.CountyName;
          // console.log('縣市的氣象站', cityCount);
          if (city) {
            if (!cityCount[city]) {
              cityCount[city] = 0; //將city設為0
            }
            cityCount[city]++; //若是有重複的縣市，數量會累加
          }
          console.log('縣市的氣象站', city, cityCount[city]);
        }
        return Object.entries(cityCount).map(([city, count]) => ({
          city,
          count,
        }));
      })
    );
  }
  //叫所有縣市
  getAllCity(): Observable<string[]> {
    return this.apiData.pipe(
      map((data) => {
        const stations = data.records.Station;
        const noRepectCity: string[] = []; //不重複的縣市名稱。
        stations.forEach((station: any) => {
          const countyName = station.GeoInfo.CountyName;
          if (countyName && noRepectCity.indexOf(countyName) === -1) {
            noRepectCity.push(countyName);
          }
        });
        return noRepectCity;
      })
    );
  }
  //指定縣市的鄉鎮市區
  getTownByCity(selectedCity: string): Observable<string[]> {
    //接收參數selectedCity
    return this.apiData.pipe(
      map((data) => {
        const stations = data.records.Station;
        const towns = stations
          .filter((station: any) => station.GeoInfo.CountyName === selectedCity)
          .map((station: any) => station.GeoInfo.TownName)
          .filter((townName: string, index: number, self: string[]) => {
            return self.indexOf(townName) === index; // 過濾重複的鄉鎮名稱
          });
        return towns;
      })
    );
  }
  //返回根據縣市和鄉鎮市區篩選的氣象站列表
  getStationsByFilter(
    selectedCity: string,
    selectedTown: string
  ): Observable<any[]> {
    return this.apiData.pipe(
      map((data) => {
        console.log('API 資料測試:', data);
        const stations = data.records.Station;
        return stations.filter((station: any) => {
          const cityMath = station.GeoInfo.CountyName === selectedCity; //縣市匹配
          const townMath = station.GeoInfo.TownName === selectedTown; //鄉鎮匹配
          return cityMath && townMath;
        });
      })
    );
  }
}
