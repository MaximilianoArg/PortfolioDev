import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../servicio/account.service';
import { Account } from '../servicio/account.interfaces';

@Component({
    selector: 'app-cuentas',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './cuentas.component.html',
    styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {
    accounts: Account[] = [];
    showAddModal = false;
    editingAccount: Account | null = null;
    newAccount: Partial<Account> = {
        name: '',
        balance: 0,
        currency: 'ARS'
    };

    constructor(
        private accountService: AccountService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadAccounts();
    }

    loadAccounts(): void {
        this.accountService.getAccounts().subscribe({
            next: (data) => {
                this.accounts = data;
            },
            error: (err) => console.error('Error loading accounts', err)
        });
    }

    openAddModal(): void {
        this.showAddModal = true;
        this.editingAccount = null;
        this.newAccount = { name: '', balance: 0, currency: 'ARS' };
    }

    closeModal(): void {
        this.showAddModal = false;
        this.editingAccount = null;
    }

    saveAccount(): void {
        if (this.editingAccount) {
            // Edit mode
            if (this.editingAccount.id) {
                this.accountService.updateAccount(this.editingAccount.id, this.newAccount).subscribe({
                    next: () => {
                        this.loadAccounts();
                        this.closeModal();
                    },
                    error: (err) => console.error('Error updating account', err)
                });
            }
        } else {
            // Create mode
            // Simple auto-detect bank logic
            if (this.newAccount.name?.toLowerCase().includes('galicia')) {
                this.newAccount.bank_name = 'Galicia';
            } else if (this.newAccount.name?.toLowerCase().includes('santander')) {
                this.newAccount.bank_name = 'Santander';
            } else if (this.newAccount.name?.toLowerCase().includes('bbva')) {
                this.newAccount.bank_name = 'BBVA';
            }

            this.accountService.createAccount(this.newAccount as Account).subscribe({
                next: () => {
                    this.loadAccounts();
                    this.closeModal();
                },
                error: (err) => console.error('Error creating account', err)
            });
        }
    }

    editAccount(account: Account): void {
        this.editingAccount = account;
        this.newAccount = { ...account };
        this.showAddModal = true;
    }

    deleteAccount(id: number): void {
        if (confirm('¿Estás seguro de eliminar esta cuenta?')) {
            this.accountService.deleteAccount(id).subscribe({
                next: () => this.loadAccounts(),
                error: (err) => console.error('Error deleting account', err)
            });
        }
    }

    getBankLogo(bankName?: string): string {
        // Placeholder logic for bank logos
        if (!bankName) return 'assets/icons/bank-default.png';
        // In a real app, you'd map this to actual assets
        return `assets/icons/${bankName.toLowerCase()}.png`;
    }

    goToDetail(id: number): void {
        this.router.navigate(['/finanzas/cuentas', id]);
    }
}
