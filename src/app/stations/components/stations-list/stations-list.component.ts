import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AppStation } from '../../model/app-station.model';
import { StationsStore } from '../../store/stations.store';

@Component({
  selector: 'app-stations-list',
  templateUrl: './stations-list.component.html',
  styleUrls: ['./stations-list.component.scss']
})
export class StationsListComponent implements OnInit, OnDestroy {

  appStationsSubscription: Subscription;

  appStations: AppStation[] | null = null;
  
  constructor(private stationsStore: StationsStore) {

    this.appStationsSubscription = this.stationsStore.appStation$.subscribe((appStations: AppStation[] | null) => {

      this.appStations = appStations;
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    
    this.appStationsSubscription.unsubscribe();
  }

}
