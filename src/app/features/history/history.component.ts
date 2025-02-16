import { Component } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h2>Search History</h2>
      <ul>
        <li *ngFor="let record of history; let i = index">
          <strong>{{ record.query }}</strong> ({{ record.timestamp }})
          <button (click)="clearHistory(i)">❌</button>
        </li>
      </ul>
    </div>
  `,
  styles: [],
})
export class HistoryComponent {
  history: any[] = [];

  constructor(private githubService: GithubService) {
    this.githubService.searchHistory$.subscribe((history: any) => {
      this.history = history;
    });
  }

  clearHistory(index: number) {
    this.githubService.clearHistoryItem(index);
  }
}
