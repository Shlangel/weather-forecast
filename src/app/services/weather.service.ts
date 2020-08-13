import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { IForecast } from '../interfaces/forecast.interface';
import { ICity } from '../interfaces/city.interface';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private http: HttpClient
    ) { }

  public getForecast(cityName: string): Observable<IForecast> {
    return this.http.get<IForecast>(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e925447cbf57c1cecdeb3e95cc3cb78a`);
  }

  public getCities(): Observable<ICity[]> {
    return this.http.get<ICity[]>('../../assets/city-list.json')
      .pipe(
        map((data: any) => data.map(city => city = city.name))
      );
  }

  public directionDetermination(deg: string): Observable<string> {
    const direction = deg === '0' || '360' ? 'nothern'
                    : deg > '0' && deg < '90' ? 'northeast'
                    : deg === '90' ? 'eastern'
                    : deg > '90' && deg < '180' ? 'southeast'
                    : deg === '180' ? 'south'
                    : deg > '180' && deg < '270' ? 'southwest'
                    : deg === '270' ? 'west'
                    : deg > '270' && deg < '360' ? 'northwest' : null;
    return of(direction);
  }

}
