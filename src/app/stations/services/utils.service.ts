import { Injectable } from '@angular/core';
import { AppStation } from '../model/app-station.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  compareName(appStation1: AppStation, appStation2: AppStation) {
    
    if ( appStation1.name< appStation2.name ) {
      return -1;
    }
    else if ( appStation1.name > appStation2.name ){
      return 1;
    }
    return 0;
   };
}
