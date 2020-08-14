import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { IForecast } from '../../interfaces/forecast.interface';
import { ICity } from '../../interfaces/city.interface';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  public forecast: IForecast;
  public cities: ICity[] = [];
  public system = 'fahrenheit';
  public temp: number;
  public currentCity = 'Krasnodar';

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.getForecast('Krasnodar');
    this.getCities();
  }

  public getForecast(city?: string): void {
    this.weatherService.getForecast(city)
      .subscribe((response: IForecast) => {
        this.forecast = response;
        this.iconSelect(response.weather[0].main);
        this.forecast.main.temp = (response.main.temp - 273.15) * 9 / 5 + 32;
        this.temp = Math.round(this.forecast.main.temp * 10 / 10);
        this.weatherService.directionDetermination(`${response.wind.deg}`).subscribe(deg => this.forecast.wind.deg = deg);
      }
      );
  }

  public getCities(): void {
    this.weatherService.getCities()
      .subscribe((response: ICity[]) => {
        this.cities = response;
      });
  }

  public conversion(system: string): void {
    if (system === this.system) {
      return;
    }
    this.temp = system === 'celsius' ? Math.round(((this.forecast.main.temp - 32) * 5 / 9 * 10) / 10)
      : system === 'fahrenheit' ? Math.round((this.forecast.main.temp * 10) / 10) : null;
    this.system = system;
  }

  public iconSelect(icon: string): void {
    this.weatherService.iconSelect(icon)
      .subscribe(response =>
        this.forecast.weather[0].icon = response
      );
  }
}
