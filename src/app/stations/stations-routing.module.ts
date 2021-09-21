import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './components/details/details.component';
import { StationsListComponent } from './components/stations-list/stations-list.component';

const routes: Routes = [
  { path: 'list', component: StationsListComponent },
  { path: ':id/details', component: DetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationsRoutingModule { }
