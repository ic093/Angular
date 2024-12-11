import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { WeatherSearchComponent } from './weather-search/weather-search.component';

//設定路由
const routes: Routes = [
  { path: 'home', title: '首頁', component: HomeComponent },
  {
    path: 'weather-search',
    title: '天氣站查詢',
    component: WeatherSearchComponent,
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
