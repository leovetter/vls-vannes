import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StationsStore } from 'src/app/core/store/stations.store';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  constructor(private router: Router,
              private stationsStore: StationsStore,
              private toastr: ToastrService) { }

  ngOnInit(): void {

    // Subscribe to notif
    this.stationsStore.notification$.subscribe(name => {

      if (name)
        this.toastr.warning(`There is no more docks available for the station ${name}`);
    });
  }

  /**
   * Navigate to homepage
   */
  goHome() {
    this.router.navigateByUrl('');
  }

}
