import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StationsInformation } from '../../stations/model/stations-information.interface';
import { StationsStatus } from '../../stations/model/stations-status.interface';

@Injectable({
  providedIn: 'root'
})
export class StationsService {

  constructor(private http: HttpClient) { }

  /**
   * Get the station information from https://www.data.gouv.fr/fr/datasets/etat-des-stations-position-geographique-et-disponibilites-du-service-vls-veloceo-de-vannes-gbfs/
   * that describe basic inforamtion about station.
   * 
   * @returns Observable<StationsInformation>
   */
  getStationInformation(): Observable<StationsInformation> {
    return this.http.get<StationsInformation>('api/gbfs/en/station_information.json')
  }

  /**
   * Get tthe status information from https://www.data.gouv.fr/fr/datasets/etat-des-stations-position-geographique-et-disponibilites-du-service-vls-veloceo-de-vannes-gbfs/
   * that describe the capacity and rental availability of a station.
   * 
   * @returns Observable<StationsStatus>
   */
  getStationStatus(): Observable<StationsStatus> {
    return this.http.get<StationsStatus>('api/gbfs/en/station_status.json');
  }
}
