import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import { GithubService } from '../../services/github.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('HistoryComponent (Standalone)', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;
  let githubService: jasmine.SpyObj<GithubService>;

  beforeEach(async () => {
    const githubServiceMock = jasmine.createSpyObj('GithubService', ['clearHistoryItem'], {
      searchHistory$: of([
        { query: 'angular', timestamp: '2025-02-16 10:00:00' },
        { query: 'react', timestamp: '2025-02-16 10:05:00' }
      ]),
    });

    await TestBed.configureTestingModule({
      imports: [HistoryComponent, CommonModule],  // Import standalone component
      providers: [{ provide: GithubService, useValue: githubServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    githubService = TestBed.inject(GithubService) as jasmine.SpyObj<GithubService>;

    fixture.detectChanges(); // Trigger Angular change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the search history', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const listItems = compiled.querySelectorAll('li');

    expect(listItems.length).toBe(2);
    expect(listItems[0].textContent).toContain('angular');
    expect(listItems[1].textContent).toContain('react');
  });

  it('should call clearHistoryItem when clearHistory is triggered', () => {
    component.clearHistory(0);
    expect(githubService.clearHistoryItem).toHaveBeenCalledWith(0);
  });

  it('should update the history when new data is received', () => {
    const newHistory = [
      { query: 'vue', timestamp: '2025-02-16 10:10:00' },
    ];
    githubService.searchHistory$ = of(newHistory);
    
    githubService.searchHistory$.subscribe(() => {
      component.history = newHistory;
      fixture.detectChanges();
      
      expect(component.history.length).toBe(1);
      expect(component.history[0].query).toBe('vue');
    });
  });
});
