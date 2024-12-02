export class WeatherStation {
  public stationID: string; // 氣象站代號
  public locationName: string; // 氣象站名稱

  public temperature: string; // 當前溫度
  public obsTime: string; // 觀測時間

  constructor() {
    this.stationID = '';
    this.locationName = '';
    this.temperature = '';
    this.obsTime = '';
  }
}
