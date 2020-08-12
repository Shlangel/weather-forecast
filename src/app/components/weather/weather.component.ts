import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { IForecast } from '../../interfaces/forecast.interface';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  public forecast: IForecast;
  public system = 'fahrenheit';

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getForecast();
  }

  public getForecast(): void {
    this.weatherService.getForecast('Moscow')
      .subscribe((response: IForecast) => {
        this.forecast = response;
        this.weatherService.directionDetermination(`${response.wind.deg}`).subscribe(deg => this.forecast.wind.deg = deg);
      }
      );
  }

  public conversion(system: string): void {
    if (system === this.system) {
      return;
    }
    system === 'celsius' ? this.forecast.main.temp *= 33.8 : system === 'fahrenheit' ? this.forecast.main.temp /= 33.8 : null;
    this.system = system;
  }

}
