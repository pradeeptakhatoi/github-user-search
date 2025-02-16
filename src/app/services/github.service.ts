import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GithubService {
    private searchHistorySubject = new BehaviorSubject<any[]>(this.loadHistory());
    searchHistory$ = this.searchHistorySubject.asObservable();

    private API_URL = 'https://api.github.com/search/users?q=';

    constructor(private http: HttpClient) { }

    searchUsers(query: string): Observable<any> {
        return this.http.get<any>(`${this.API_URL}${query}`);
    }

    saveToHistory(query: string, result: any) {
        const history = this.loadHistory();
        history.unshift({ query, result, timestamp: new Date() });
        localStorage.setItem('searchHistory', JSON.stringify(history));
        this.searchHistorySubject.next(history);
    }

    clearHistoryItem(index: number) {
        const history = this.loadHistory();
        history.splice(index, 1);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        this.searchHistorySubject.next(history);
    }

    private loadHistory(): any[] {
        return JSON.parse(localStorage.getItem('searchHistory') || '[]');
    }
}
