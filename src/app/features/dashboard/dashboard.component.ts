import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div>
      <h1>GitHub User Search App</h1>
      <nav>
        <a routerLink="/search">🔍 Search</a> |
        <a routerLink="/history">📜 History</a>
      </nav>
    </div>
  `,
  styles: [],
})
export class DashboardComponent { }
