import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import { IncompleteApiError } from '../errors/incomplete-api-error.error';
import { AppStation } from '../model/app-station.model';
import { StationInformation } from '../model/station-information.interface';
import { StationStatus } from '../model/station-status.interface';
import { StationsInformation } from '../model/stations-information.interface';
import { StationsStatus } from '../model/stations-status.interface';
import { StationsService } from '../services/stations.service';

@Injectable({
  providedIn: 'root'
})
export class StationsStore {

    private appStationSubject = new BehaviorSubject<AppStation[] | null>(null);
    appStation$: Observable<AppStation[] | null> = this.appStationSubject.asObservable();

    constructor(private stationsService: StationsService) {

        this.updateStations();
    }

    updateStations() {

        // Retreive informations of the stations from the api
        forkJoin([
            this.stationsService.getStationInformation(),
            this.stationsService.getStationStatus(),
        ]).subscribe(res => {

            const stationsInformations: StationsInformation = res[0];
            const stationsStatus: StationsStatus = res[1];

            // Iterate over the two datasets from the api to build one appStations model which will be used 
            // in our app.
            const appStations: AppStation[] = [];
            stationsInformations.data.stations.forEach((stationInformations: StationInformation) => {

                let stationStatus: StationStatus | null = null;
                for(let i = 0; i < stationsStatus.data.stations.length; i++) {

                    stationStatus = stationsStatus.data.stations[i];
                    if (stationStatus.station_id === stationInformations.station_id) break;
                }

                if (stationStatus !== null ) {

                    const appStation: AppStation = new AppStation(stationInformations.station_id, stationInformations.name,
                    stationInformations.lat, stationInformations.lon, stationInformations.capacity, stationStatus.num_bikes_available,
                    stationStatus.num_bikes_disabled, stationStatus.num_docks_available, stationStatus.is_installed, 
                    stationStatus.is_renting, stationStatus.is_returning, stationStatus.last_reported);

                    appStations.push(appStation);
                } else {

                    throw new IncompleteApiError('A station information has no corresponding station status');
                }
                
            })
            
            this.appStationSubject.next(appStations);
        });
    }
}
