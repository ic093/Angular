import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-weather-detail-modal',
  templateUrl: './weather-detail-modal.component.html',
  styleUrl: './weather-detail-modal.component.css',
})
export class WeatherDetailModalComponent {
  @Input() station: any; //接收weather-search.component.ts傳遞的資料
  // Google Maps 屬性
  mapCenter: google.maps.LatLngLiteral = { lat: 0, lng: 0 };
  zoom: number = 14;
  mapOptions: google.maps.MapOptions = {
    mapId: environment.googleMapsMapId, //保護mapId
    disableDefaultUI: false,
    fullscreenControl: true,
  };

  constructor(public activeModal: NgbActiveModal, private datePipe: DatePipe) {}
  ngOnInit(): void {
    // 更新設定地圖中心點
    if (this.station && this.station.GeoInfo.Coordinates) {
      const coordinates = this.station.GeoInfo.Coordinates[0];
      this.mapCenter = {
        lat: coordinates.StationLatitude,
        lng: coordinates.StationLongitude,
      };
    }
  }
  //轉日期格式
  formatDate(date: string) {
    return this.datePipe.transform(date, 'yyyy-MM-dd HH:mm:ss');
  }
}
//NgbActiveModal 是 ng-bootstrap 提供的，用於控制彈窗（modal）的行為，例如關閉或操作彈窗。
