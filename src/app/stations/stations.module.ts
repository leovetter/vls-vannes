import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StationsRoutingModule } from './stations-routing.module';
import { StationsListComponent } from './components/stations-list/stations-list.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    StationsListComponent
  ],
  imports: [
    CommonModule,
    StationsRoutingModule,
  ]
})
export class StationsModule { }
