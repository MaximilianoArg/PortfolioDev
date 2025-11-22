import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Budget } from './category.interfaces';

@Injectable({
    providedIn: 'root',
})
export class BudgetService {
    private apiUrl = 'http://127.0.0.1:8000/api/budgets/';

    constructor(private http: HttpClient) { }

    getBudgets(month?: string, account?: number): Observable<Budget[]> {
        let params = new HttpParams();
        if (month) {
            params = params.set('month', month);
        }
        if (account) {
            params = params.set('account', account.toString());
        }
        return this.http.get<Budget[]>(this.apiUrl, { params });
    }

    getBudget(id: number): Observable<Budget> {
        return this.http.get<Budget>(`${this.apiUrl}${id}/`);
    }

    createBudget(budget: Partial<Budget>): Observable<Budget> {
        return this.http.post<Budget>(this.apiUrl, budget);
    }

    updateBudget(id: number, budget: Partial<Budget>): Observable<Budget> {
        return this.http.put<Budget>(`${this.apiUrl}${id}/`, budget);
    }

    deleteBudget(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }

    // Helper para obtener el estado del presupuesto
    getBudgetStatus(percentage: number): 'success' | 'warning' | 'danger' {
        if (percentage < 70) return 'success';
        if (percentage < 90) return 'warning';
        return 'danger';
    }
}
