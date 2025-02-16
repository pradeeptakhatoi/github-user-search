import { TestBed } from '@angular/core/testing';
import { GithubService } from './github.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('GithubService', () => {
    let service: GithubService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GithubService],
        });

        service = TestBed.inject(GithubService);
        httpMock = TestBed.inject(HttpTestingController);

        localStorage.clear(); // Clear localStorage before each test
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call searchUsers and return user data', () => {
        const mockResponse = { items: [{ login: 'testuser' }] };
        const query = 'angular';

        service.searchUsers(query).subscribe((response) => {
            expect(response).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`https://api.github.com/search/users?q=${query}`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should save search history to localStorage', () => {
        const query = 'react';
        const result = { items: [{ login: 'testuser' }] };

        service.saveToHistory(query, result);

        const savedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        expect(savedHistory.length).toBe(1);
        expect(savedHistory[0].query).toBe(query);
    });

    it('should update BehaviorSubject when saving search history', () => {
        const query = 'vue';
        const result = { items: [{ login: 'testuser' }] };

        service.saveToHistory(query, result);

        service.searchHistory$.subscribe((history) => {
            expect(history.length).toBe(1);
            expect(history[0].query).toBe(query);
        });
    });

    it('should remove an item from search history', () => {
        const query1 = 'angular';
        const query2 = 'react';
        service.saveToHistory(query1, { items: [] });
        service.saveToHistory(query2, { items: [] });

        service.clearHistoryItem(0);

        const updatedHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        expect(updatedHistory.length).toBe(1);
        expect(updatedHistory[0].query).toBe(query1); // React was removed
    });

    it('should load history from localStorage', () => {
        const historyData = [{ query: 'nodejs', timestamp: new Date().toISOString() }];
        localStorage.setItem('searchHistory', JSON.stringify(historyData));

        const loadedHistory = service['loadHistory']();
        expect(loadedHistory.length).toBe(1);
        expect(loadedHistory[0].query).toBe('nodejs');
    });
});
