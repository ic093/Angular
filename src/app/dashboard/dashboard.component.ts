import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  item = [
    { text: '溫度', icon: 'bi bi-thermometer-low', class: 'item1' },
    { text: '風速', icon: 'bi bi-wind', class: 'item2' },
    { text: '氣象', icon: 'bi bi-cloud-sun-fill', class: 'item3' },
  ];
}
