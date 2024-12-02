import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailComponent } from './detail/detail.component';
import { provideHttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { WeatherSearchComponent } from './weather-search/weather-search.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps';
import { WeatherDetailModalComponent } from './weather-detail-modal/weather-detail-modal.component';

//設定路由
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'weather-search', component: WeatherSearchComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    DashboardComponent,
    DetailComponent,
    WeatherSearchComponent,
    HomeComponent,
    WeatherDetailModalComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes), // 設定路由
    FormsModule,
    DataTablesModule,
    NgbModule,
    GoogleMapsModule,
  ],
  providers: [provideHttpClient(), DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
