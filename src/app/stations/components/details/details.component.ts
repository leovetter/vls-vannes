import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppStation } from '../../model/app-station.model';
import { StationsStore } from '../../../core/store/stations.store';
import { faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  appStation$: Observable<AppStation  | undefined>;

  faStar = faStar;
  faArrowLeft = faArrowLeft;

  constructor(private route: ActivatedRoute,
              private stationsStore: StationsStore,
              private router: Router) { }

  ngOnInit(): void {

    // Start navigation at the top of the page
    window.scroll(0, 0);

    // Get the station corresponding to the id given in parameters of the route
    this.route.params.subscribe(params => {
      this.appStation$ = this.stationsStore.getAppStation(params.id);
    });
  }

  /**
   * Navigate to the page stations list 
   */
  goList() {
    this.router.navigateByUrl('stations/list');
  }

  /**
   * When the user decid mark station with corresponding id to favorite
   * 
   * @param id string
   */
  markAsFavorite(id: string) {
    this.stationsStore.markAsFavorite(id);
  }

}
