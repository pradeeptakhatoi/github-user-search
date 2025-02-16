import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="card shadow-lg p-4">
        <h2 class="text-center mb-4 text-primary">🔍 GitHub User Search</h2>

        <!-- Search Input -->
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control form-control-lg border-primary"
            [(ngModel)]="query"
            placeholder="Enter GitHub username..."
          />
          <button class="btn btn-primary" (click)="onSearch()">Search</button>
        </div>

        <!-- Back & History Buttons -->
        <div class="d-flex justify-content-between">
          <button class="btn btn-secondary" (click)="goBack()">⬅ Back</button>
          <button class="btn btn-info" (click)="viewHistory()">📜 View History</button>
        </div>

        <!-- User List -->
        <ul *ngIf="users.length > 0" class="list-group mt-3">
          <li *ngFor="let user of users" class="list-group-item d-flex align-items-center">
            <img [src]="user.avatar_url" class="avatar me-3" />
            <div>
              <a [href]="user.html_url" target="_blank" class="fw-bold text-dark">{{ user.login }}</a>
              <small class="d-block text-muted">GitHub Profile</small>
            </div>
          </li>
        </ul>

        <!-- No Results Message -->
        <p *ngIf="users.length === 0 && searched" class="text-muted text-center mt-3">
          No users found. Try another search.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .container {
        max-width: 600px;
      }
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    `,
  ],
})
export class SearchComponent {
  query = '';
  users: any[] = [];
  searched = false;

  constructor(private githubService: GithubService, private router: Router) { }

  onSearch() {
    if (!this.query.trim()) return;
    this.githubService.searchUsers(this.query).subscribe((response: any) => {
      this.users = response.items;
      this.searched = true;
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }

  viewHistory() {
    this.router.navigate(['/history']);
  }
}
