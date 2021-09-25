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

        // Init our model.
        this.updateStations();
        // Refresh the model every minute.
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

            // Retrieve our two sources of information about a station
            const stationsInformations: StationsInformation = res[0];
            const stationsStatus: StationsStatus = res[1];

            // Get precedent model. Used to remember the favorite stations. 
            const oldAppStations = this.appStationSubject.getValue();

            // Iterate over the two datasets from the api to build one appStations model which will be used 
            // in our app.
            let appStations: AppStation[] = [];
            stationsInformations.data.stations.forEach((stationInformations: StationInformation) => {

                // Associate a station status with a station information
                const stationStatus = this.getStationStatus(stationsStatus, stationInformations);
                // Find the correspondig appStation. Used to remember the favorite stations. 
                const oldAppStation = this.getOldAppStation(oldAppStations, stationInformations);
                // Create the app stations model
                if (stationStatus !== null ) {
                    appStations = this.createAppStation(appStations, stationStatus, stationInformations, oldAppStation);
                } else {

                    // Thwrow error coming from the api if no corresponding stationStatus is found. 
                    throw new IncompleteApiError('A station information has no corresponding station status');
                }
            });
            
            // Associate random number to mitigate the limitations of the api
            appStations = this.assignRandomValues(appStations);

            // Refresh the subject with right value 
            this.appStationSubject.next(appStations);
        });
    }

    /**
     * Return the station corresponding to the id
     * 
     * @param id string
     * @returns Observable<AppStation | undefined>
     */
    getAppStation(id: string): Observable<AppStation | undefined> {

        return this.appStation$.pipe(
            map(appStations => appStations.find(appStation => appStation.id === id))
        )
    }

    /**
     * Mark the station with corresponding id as favorite or unmark it.
     * 
     * @param id string
     */
    markAsFavorite(id: string) {

        // Get value from the subject
        const appStations = this.appStationSubject.getValue();

        // Iterate to find the right station
        appStations.forEach(appStation => {

            if (appStation.id === id && !appStation.isFavorite) appStation.setFavorite(true);
            else if (appStation.id === id && appStation.isFavorite) appStation.setFavorite(false);
        });

        // Refresh the subject with new value
        this.appStationSubject.next([...appStations]);

    }

    /**
     * Informations about the same station comes from two different sources in the api.
     * Find which station status correspond to which station information.
     * 
     * @param stationsStatus StationsStatus
     * @param stationInformations StationInformation
     * @returns stationsStatus StationsStatus
     */
    getStationStatus(stationsStatus: StationsStatus, stationInformations: StationInformation): StationStatus | null {

        let stationStatus: StationStatus | null = null;
        for(let i = 0; i < stationsStatus.data.stations.length; i++) {

            stationStatus = stationsStatus.data.stations[i];
            if (stationStatus.station_id === stationInformations.station_id) return stationStatus;
            
        }

        return null;
    }

    /**
     * Find which station is assotiated with the informations coming from the api.
     * return null if no station is found.
     * 
     * @param oldAppStations AppStation[]
     * @param stationInformations StationInformation
     * @returns appStations AppStation[] | null
     */
    getOldAppStation(oldAppStations: AppStation[], stationInformations: StationInformation): AppStation | null {
        
        if (oldAppStations !== []) {

            for(let i = 0; i < oldAppStations.length; i++) {

                const oldAppStation = oldAppStations[i];
                if (oldAppStation.id === stationInformations.station_id) return oldAppStation;
            }
        }

        return null;
    }

    /**
     * Create appStation model from the two sources of information coming from the api
     * oldAppStation is used to retain information about favorite station when data is refreshed
     * 
     * @param appStations AppStation[]
     * @param stationStatus StationStatus
     * @param stationInformations StationInformations
     * @param oldAppStation AppStation
     * @returns appStations AppStation[]
     */
    createAppStation(appStations: AppStation[], stationStatus: StationStatus, 
                     stationInformations: StationInformation, oldAppStation: AppStation | null): AppStation[] {

        let isFavorite = false;
        if (oldAppStation) isFavorite = oldAppStation.isFavorite;

        const appStation: AppStation = new AppStation(stationInformations.station_id, stationInformations.name,
        stationInformations.lat, stationInformations.lon, stationInformations.capacity, stationStatus.num_bikes_available,
        stationStatus.num_bikes_disabled, stationStatus.num_docks_available, stationStatus.is_installed, 
        stationStatus.is_renting, stationStatus.is_returning, stationStatus.last_reported, isFavorite);

        appStations.push(appStation)
        return appStations;
    }

    /**
     * Assignate random numbers to propertis to simulate dynamism.
     * 
     * @param appStations AppStation[]
     * @returns appStations AppStation[]
     */
    assignRandomValues(appStations: AppStation[]): AppStation[] {

        appStations[2].num_docks_available = 0;
        appStations[3].num_bikes_available = 5;
        appStations[7].num_docks_available = 0;
        appStations[8].num_bikes_available = 1;
        appStations[9].num_docks_available = 0;
        appStations[10].num_bikes_available = 10;
        appStations[1].is_installed = 0;
        appStations[4].is_installed = 0;
        appStations[6].is_installed = 0;

        return appStations;
    }
}
