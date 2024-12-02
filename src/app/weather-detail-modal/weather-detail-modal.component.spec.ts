import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherDetailModalComponent } from './weather-detail-modal.component';

describe('WeatherDetailModalComponent', () => {
  let component: WeatherDetailModalComponent;
  let fixture: ComponentFixture<WeatherDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeatherDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
