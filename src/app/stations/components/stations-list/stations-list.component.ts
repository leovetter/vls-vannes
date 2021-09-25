import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, fromEvent, Observable, of, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppStation } from '../../model/app-station.model';
import { UtilsService } from '../../services/utils.service';
import { StationsStore } from '../../store/stations.store';

@Component({
  selector: 'app-stations-list',
  templateUrl: './stations-list.component.html',
  styleUrls: ['./stations-list.component.scss']
})
export class StationsListComponent implements OnInit, OnDestroy {

  appStationsSubscription: Subscription;
  appStations: AppStation[] = [];
  
  constructor(private stationsStore: StationsStore,
              private utilsService: UtilsService,
              private router: Router) { }

  ngOnInit(): void {

    // Find the html element with which the user will interact
    const inputName = document.querySelector('#search-name') as HTMLElement;
    const bikesToggle = document.querySelector('#bikes-toggle') as HTMLElement;
    const docksToggle = document.querySelector('#docks-toggle') as HTMLElement;

    /**
     * Create an observable derived from the appStations model as well as the different filters 
     * 
     * @link https://rxjs.dev/api/index/function/combineLatest
     * @link https://rxjs.dev/api/index/function/fromEvent
     * @link https://rxjs.dev/api/operators/startWith
     */
    this.appStationsSubscription = combineLatest([
      // appStations observable
      this.stationsStore.appStation$,
      // Observable that will emit the name the the user is searching for.
      // First value emmited is force to empty string (when the user has done nothing)
      fromEvent(inputName, 'keyup').pipe( 
        map((event: any) => event.target.value),
        startWith('')),
      // Observable that will emit if the user want stations with at least one bike
      // First value emmited is force to value false (when the user has done nothing)
      fromEvent(bikesToggle, 'click').pipe(
        map((val: any) => val.target.className.indexOf('right') === -1),
        startWith(false)),
      // Observable that will emit if the user want stations with at least one dock
      // First value emmited is force to value false (when the user has done nothing)
      fromEvent(docksToggle, 'click').pipe(
          map((val: any) => val.target.className.indexOf('right') === -1),
          startWith(false)
      )
    ]).subscribe((res: any) => {

      // Retreive our appStations model and the value of the different inputs (filters)
      const appStations: AppStation[] = [...res[0]];
      const searchName = res[1];
      const atLeast1Bikes = res[2];
      const atLeast1Docks = res[3];

      // Filter the stations
      const filteredAppStations = this.filterAppStations(appStations, searchName, atLeast1Bikes, atLeast1Docks);
      // Sort the stations to have favorites stations first in list
      this.appStations = this.utilsService.setUpFavorites(filteredAppStations);

    });
  }

  ngOnDestroy(): void {
    
    // Unsubscribe the subscription made on initialization of the component
    this.appStationsSubscription.unsubscribe();
  }

  /**
   * Navigate to the page details of the station corresponding to the id
   * 
   * @param idAppStation string
   */
  goDetails(idAppStation: string) {
    this.router.navigateByUrl(`stations/${idAppStation}/details`);
  }

  /**
   * Initial appStations model contain all the appSTation from the api.
   * The method will fillter the stations to return only the stations corresponding
   * to the filters used by the user. Also sort the station by name.
   * 
   * @param appStations AppStation[]
   * @param searchName string
   * @param atLeast1Bikes boolean
   * @param atLeast1Docks boolean
   * @returns filteredAppStations AppStation[]
   */
  filterAppStations(appStations: AppStation[], searchName: string, atLeast1Bikes: boolean, atLeast1Docks: boolean) {

      let filteredAppStations: AppStation[] = appStations;
      // Filter by bikes
      if(atLeast1Bikes) filteredAppStations = appStations.filter(appStation => appStation.num_bikes_available >= 1)
      // Filter by docks
      if(atLeast1Docks) filteredAppStations = filteredAppStations.filter(appStation => appStation.num_docks_available >= 1)

      // Filter by name and finally sort by name
      if(searchName === '') 
        filteredAppStations = filteredAppStations.sort(this.utilsService.compareName);
      else {
        filteredAppStations = filteredAppStations.filter(appStation => appStation.name.toLowerCase()
                                                                           .indexOf(searchName.toLowerCase()) !== -1)
                                                                           .sort(this.utilsService.compareName)
      }

      return filteredAppStations;
  }

  

}

