import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.interfaces';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    private apiUrl = 'http://127.0.0.1:8000/api/categories/';

    constructor(private http: HttpClient) { }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }

    getCategoriesByType(type: 'INGRESO' | 'GASTO'): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}?type=${type}`);
    }

    getCategory(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}${id}/`);
    }

    createCategory(category: Partial<Category>): Observable<Category> {
        return this.http.post<Category>(this.apiUrl, category);
    }

    updateCategory(id: number, category: Partial<Category>): Observable<Category> {
        return this.http.put<Category>(`${this.apiUrl}${id}/`, category);
    }

    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }
}
