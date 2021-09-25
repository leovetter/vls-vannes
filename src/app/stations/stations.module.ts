import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationsRoutingModule } from './stations-routing.module';
import { StationsListComponent } from './components/stations-list/stations-list.component';
import { HighlightInputDirective } from './directives/highlight-input.directive';
import { ToggleDirective } from './directives/toggle-directive.directive';
import { DetailsComponent } from './components/details/details.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    StationsListComponent,
    HighlightInputDirective,
    ToggleDirective,
    DetailsComponent,
    FormatDatePipe
  ],
  imports: [
    CommonModule,
    StationsRoutingModule,
    FontAwesomeModule,
    GoogleMapsModule
  ]
})
export class StationsModule { }
