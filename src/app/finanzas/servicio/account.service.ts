import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from './account.interfaces';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private apiUrl = 'http://127.0.0.1:8000/api/accounts/';

    constructor(private http: HttpClient) { }

    getAccounts(): Observable<Account[]> {
        return this.http.get<Account[]>(this.apiUrl);
    }

    createAccount(account: Account | FormData): Observable<Account> {
        return this.http.post<Account>(this.apiUrl, account);
    }

    updateAccount(id: number, account: Partial<Account> | FormData): Observable<Account> {
        return this.http.patch<Account>(`${this.apiUrl}${id}/`, account);
    }

    deleteAccount(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}${id}/`);
    }

    // Credits
    getAccount(id: number): Observable<Account> {
        return this.http.get<Account>(`${this.apiUrl}${id}/`);
    }

    createCredit(accountId: number, credit: any): Observable<any> {
        // We need to assign the account ID to the credit
        const creditData = { ...credit, account: accountId };
        return this.http.post<any>('http://127.0.0.1:8000/api/credits/', creditData);
    }

    updateCredit(id: number, credit: any): Observable<any> {
        return this.http.patch<any>(`http://127.0.0.1:8000/api/credits/${id}/`, credit);
    }

    deleteCredit(id: number): Observable<void> {
        return this.http.delete<void>(`http://127.0.0.1:8000/api/credits/${id}/`);
    }
}
