import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { SearchComponent } from './search.component';
import { GithubService } from '../../services/github.service';

describe('SearchComponent (Standalone)', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let githubService: jasmine.SpyObj<GithubService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const githubServiceMock = jasmine.createSpyObj('GithubService', ['searchUsers']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SearchComponent, FormsModule],  // Directly importing the standalone component
      providers: [
        { provide: GithubService, useValue: githubServiceMock },
        { provide: Router, useValue: routerMock },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    githubService = TestBed.inject(GithubService) as jasmine.SpyObj<GithubService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call searchUsers on GithubService when searching', () => {
    const mockResponse = { items: [{ login: 'testuser', avatar_url: '', html_url: '' }] };
    githubService.searchUsers.and.returnValue(of(mockResponse));

    component.query = 'test';
    component.onSearch();

    expect(githubService.searchUsers).toHaveBeenCalledWith('test');
    expect(component.users.length).toBe(1);
  });

  it('should not call searchUsers if query is empty', () => {
    component.query = '';
    component.onSearch();
    expect(githubService.searchUsers).not.toHaveBeenCalled();
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to history when viewHistory is called', () => {
    component.viewHistory();
    expect(router.navigate).toHaveBeenCalledWith(['/history']);
  });
});
