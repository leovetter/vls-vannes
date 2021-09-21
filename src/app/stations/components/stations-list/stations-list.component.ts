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

    const inputName = document.querySelector('#search-name') as HTMLElement;
    const bikesToggle = document.querySelector('#bikes-toggle') as HTMLElement;
    const docksToggle = document.querySelector('#docks-toggle') as HTMLElement;

    this.appStationsSubscription = combineLatest([
      this.stationsStore.appStation$,
      fromEvent(inputName, 'keyup').pipe( 
        map((event: any) => event.target.value),
        startWith('')),
      fromEvent(bikesToggle, 'click').pipe(
        map(val => (val.target as any).className.indexOf('right') === -1),
        startWith(false)),
      fromEvent(docksToggle, 'click').pipe(
          map(val => (val.target as any).className.indexOf('right') === -1),
          startWith(false)
      )
    ]).subscribe((res: any) => {

      const appStations: AppStation[] = res[0];
      const searchName = res[1];
      const atLeast1Bikes = res[2];
      const atLeast1Docks = res[3];

      let filteredAppStation: AppStation[] = appStations;
      if(atLeast1Bikes) filteredAppStation = appStations.filter(appStation => appStation.num_bikes_available >= 1)
      if(atLeast1Docks) filteredAppStation = filteredAppStation.filter(appStation => appStation.num_docks_available >= 1)

      if(searchName === '') 
        this.appStations = filteredAppStation.sort(this.utilsService.compareName);
      else {
        this.appStations = filteredAppStation.filter(appStation => appStation.name.toLowerCase()
                                                                           .indexOf(searchName.toLowerCase()) !== -1)
                                                                           .sort(this.utilsService.compareName)
      }

    });
  }

  ngOnDestroy(): void {
    
    this.appStationsSubscription.unsubscribe();
  }

  goDetails(idAppStation: string) {
    this.router.navigateByUrl(`stations/${idAppStation}/details`);
  }

  

}

