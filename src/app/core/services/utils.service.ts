import { Injectable } from '@angular/core';
import { concat } from 'rxjs';
import { AppStation } from '../../stations/model/app-station.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
   * Sort stations by name
   * 
   * @param appStation1 AppStation
   * @param appStation2 AppStation
   * @returns boolean
   */
  compareName(appStation1: AppStation, appStation2: AppStation): number {
    
    if ( appStation1.name< appStation2.name ) {
      return -1;
    }
    else if ( appStation1.name > appStation2.name ){
      return 1;
    }
    return 0;
   };

   /**
    * Sort the stations to have the favorites first in the list
    * 
    * @param appStations AppStation[]
    * @returns sortedAppStations AppStation[]
    */
   setUpFavorites(appStations: AppStation[]): AppStation[] {

      const indexOfFavorite = [];
      const favorites = [];
      for(let i = 0; i < appStations.length; i++) {

        if (appStations[i].isFavorite) {
          indexOfFavorite.push(i);
          favorites.push(appStations[i]);
        }
      }

      indexOfFavorite.reverse().forEach(index => appStations.splice(index, 1));

      return favorites.concat(appStations);
   }
}
