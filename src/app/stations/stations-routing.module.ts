import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StationsListComponent } from './components/stations-list/stations-list.component';

const routes: Routes = [
  { path: 'list', component: StationsListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationsRoutingModule { }
