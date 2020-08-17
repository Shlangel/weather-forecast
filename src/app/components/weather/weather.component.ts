import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';
import { IForecast } from '../../interfaces/forecast.interface';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  public forecast: IForecast;
  public system = 'fahrenheit';
  public temp: number;
  public currentCity = 'Krasnodar';
  public currentSystem = 'F';
  public latitude: number;
  public longitude: number;
  public search = new FormControl({ value: `${this.currentCity}`.toUpperCase(), disabled: true }, Validators.required);

  constructor(private weatherService: WeatherService) {
    this.getForecast = this.getForecast.bind(this);
  }

  ngOnInit(): void {
    this.currentCity = this.search.value?.trim();
    this.getForecast(this.currentCity);
    this.searchSubscribe();
  }

  public searchSubscribe(): void {
    this.search.valueChanges
      .pipe(debounceTime(500))
      .subscribe(this.getForecast);
  }

  public getForecast(city: string): void {
    this.weatherService.getForecast(city, this.latitude, this.longitude)
      .subscribe((response: IForecast) => {
        this.forecast = response;
        this.iconSelect(response.weather[0].main);
        this.forecast.main.temp = (response.main.temp - 273.15) * 9 / 5 + 32;
        this.temp = this.system === 'fahrenheit' ? Math.round(this.forecast.main.temp * 10 / 10)
          : Math.round(((this.forecast.main.temp - 32) * 5 / 9 * 10) / 10);
        this.weatherService.directionDetermination(`${response.wind.deg}`).subscribe(deg => this.forecast.wind.deg = deg);
      }
      );
  }

  public enableControl(): void {
    this.search.enable();
  }

  public disableControl(): void {
    this.search.disable();
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
    console.log(icon)
    this.weatherService.iconSelect(icon)
      .subscribe(response =>
        this.forecast.weather[0].icon = response
      );
  }

  public getLocation(): void {
    function location(position) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      console.log(position.coords.latitude, position.coords.longitude)
    }
    navigator.geolocation.getCurrentPosition(location);

  }
}
