import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SearchComponent } from './features/search/search.component';
import { HistoryComponent } from './features/history/history.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },
    { path: 'search', component: SearchComponent },
    { path: 'history', component: HistoryComponent },
];
