import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
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

    private appStationSubject = new BehaviorSubject<AppStation[]>([]);
    appStation$: Observable<AppStation[]> = this.appStationSubject.asObservable();

    constructor(private stationsService: StationsService) {

        this.updateStations();
        setInterval(() => this.updateStations(), 60000);
    }

    updateStations() {

        // Retreive informations of the stations from the api
        // ForkJoin will emit the last emitted values from the two observables when they both complete
        // Both requests will be run in parallel
        forkJoin([
            this.stationsService.getStationInformation(),
            this.stationsService.getStationStatus(),
        ]).subscribe(res => {

            const stationsInformations: StationsInformation = res[0];
            const stationsStatus: StationsStatus = res[1];

            const oldAppStations = this.appStationSubject.getValue();

            // Iterate over the two datasets from the api to build one appStations model which will be used 
            // in our app.
            const appStations: AppStation[] = [];
            stationsInformations.data.stations.forEach((stationInformations: StationInformation) => {

                let stationStatus: StationStatus | null = null;
                for(let i = 0; i < stationsStatus.data.stations.length; i++) {

                    stationStatus = stationsStatus.data.stations[i];
                    if (stationStatus.station_id === stationInformations.station_id) break;
                    
                }

                let oldAppStation: AppStation | null = null;
                if (oldAppStations !== []) {

                    for(let i = 0; i < oldAppStations.length; i++) {

                        const oldAppStationTemp = oldAppStations[i];
                        if (oldAppStationTemp.id === stationInformations.station_id) oldAppStation = oldAppStationTemp;
                    }
                }

                if (stationStatus !== null ) {

                    let isFavorite = false;
                    if (oldAppStation) isFavorite = oldAppStation.isFavorite;

                    const appStation: AppStation = new AppStation(stationInformations.station_id, stationInformations.name,
                    stationInformations.lat, stationInformations.lon, stationInformations.capacity, stationStatus.num_bikes_available,
                    stationStatus.num_bikes_disabled, stationStatus.num_docks_available, stationStatus.is_installed, 
                    stationStatus.is_renting, stationStatus.is_returning, stationStatus.last_reported, isFavorite);

                    appStations.push(appStation);
                } else {

                    throw new IncompleteApiError('A station information has no corresponding station status');
                }
                
            })
            
            // Associate random number to mitigate the limitations of the api
            appStations[2].num_docks_available = 0;
            appStations[3].num_bikes_available = 5;
            appStations[7].num_docks_available = 0;
            appStations[8].num_bikes_available = 1;
            appStations[9].num_docks_available = 0;
            appStations[10].num_bikes_available = 10;
            appStations[1].is_installed = 0;
            appStations[4].is_installed = 0;
            appStations[6].is_installed = 0;

            this.appStationSubject.next(appStations);
        });
    }

    getAppStation(id: string): Observable<AppStation | undefined> {

        return this.appStation$.pipe(
            map(appStations => appStations.find(appStation => appStation.id === id))
        )
    }

    markAsFavorite(id: string) {

        const appStations = this.appStationSubject.getValue();

        appStations.forEach(appStation => {

            if (appStation.id === id && !appStation.isFavorite) appStation.setFavorite(true);
            else if (appStation.id === id && appStation.isFavorite) appStation.setFavorite(false);
        });

        this.appStationSubject.next([...appStations]);

    }
}
