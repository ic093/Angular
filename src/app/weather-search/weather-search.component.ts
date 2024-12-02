import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { WeatherService } from '../weather.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import 'datatables.net';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // 引入 NgbModal
import { WeatherDetailModalComponent } from '../weather-detail-modal/weather-detail-modal.component';

@Component({
  selector: 'app-weather-search',
  templateUrl: './weather-search.component.html',
  styleUrls: ['./weather-search.component.css'],
})
export class WeatherSearchComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  city: string[] = [];
  town: string[] = [];
  selectedTown: string = '';
  selectedCity: string = '';
  weatherStations: any[] = [];

  constructor(
    private weatherService: WeatherService,
    private DatePipe: DatePipe,
    private modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers', // 顯示完整分頁按鈕
      pageLength: 25, // 每頁顯示 25 筆資料
      responsive: true,
      data: [],
      columns: [
        { title: '編號', data: 'StationId' },
        { title: '名稱', data: 'StationName' },
        { title: '縣市', data: 'GeoInfo.CountyName' },
        { title: '鄉鎮市區', data: 'GeoInfo.TownName' },
        {
          title: '最後監測時間',
          data: 'ObsTime.DateTime',
          render: (data: any) => {
            return this.DatePipe.transform(data, 'yyyy-MM-dd HH:mm:ss');
          },
        },
        { title: '目前天氣', data: 'WeatherElement.Weather' },
        {
          title: '查看明細',
          data: null,
          render: (data: any, type: any, row: any) =>
            `<button class="btn btn-dark view-detail" data-id="${row.StationId}">查看明細</button>`,
        },
      ],
    };
    this.loadCity();
  }

  loadCity(): void {
    this.weatherService.getAllCity().subscribe((city) => {
      this.city = city;
    });
  }

  onCityChange(): void {
    this.weatherService.getTownByCity(this.selectedCity).subscribe((town) => {
      // selectedCity在html的<select>的[(ngModel)]="selectedCity"，雙向綁定
      this.town = town;
      this.selectedTown = '';
    });
  }
  //開始生成動態視窗
  ngAfterViewInit(): void {
    this.dtTrigger.next(null);
    $(document).on('click', '.view-detail', (event) => {
      const stationId = $(event.target).data('id');
      const station = this.weatherStations.find(
        (i) => i.StationId === stationId
      );
      if (station) {
        this.openModal(station);
      }
    });
  }

  onSearch(): void {
    this.weatherService
      .getStationsByFilter(this.selectedCity, this.selectedTown)
      .subscribe({
        next: async (stations) => {
          if (!stations || !stations.length) {
            console.log('找不到');
            return;
          }

          this.weatherStations = stations;
          await this.rerender(); // 更新表格
        },
        error: (err) => {
          console.error('err', err);
        },
      });
  }
  async rerender(): Promise<void> {
    try {
      const dtInstance = await this.dtElement.dtInstance;
      if (!dtInstance) {
        console.error('初始化 DataTables 失敗.');
        return;
      }
      dtInstance.clear(); // 清空
      dtInstance.rows.add(this.weatherStations); // 加入資料
      dtInstance.draw(); // 重新繪製表格
    } catch (error) {
      console.error('err', error);
    }
  }

  onReset(): void {
    this.selectedCity = '';
    this.selectedTown = '';
    this.weatherStations = [];
    this.town = [];
    this.rerender();
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  //製作彈跳視窗
  openModal(station: any): void {
    const modalRef = this.modalService.open(WeatherDetailModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.station = station;
  }
}
