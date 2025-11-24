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
        this.selectedFile = null;
    }

    selectedFile: File | null = null;

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    saveAccount(): void {
        const formData = new FormData();
        formData.append('name', this.newAccount.name || '');
        formData.append('balance', String(this.newAccount.balance || 0));
        formData.append('currency', this.newAccount.currency || 'ARS');
        if (this.newAccount.tna) formData.append('tna', String(this.newAccount.tna));
        if (this.newAccount.cbu_cvu) formData.append('cbu_cvu', String(this.newAccount.cbu_cvu));

        // Simple auto-detect bank logic if not already set
        let bankName = this.newAccount.bank_name;
        if (!bankName) {
            if (this.newAccount.name?.toLowerCase().includes('galicia')) {
                bankName = 'Galicia';
            } else if (this.newAccount.name?.toLowerCase().includes('santander')) {
                bankName = 'Santander';
            } else if (this.newAccount.name?.toLowerCase().includes('bbva')) {
                bankName = 'BBVA';
            }
        }
        if (bankName) formData.append('bank_name', bankName);

        if (this.selectedFile) {
            formData.append('bank_image', this.selectedFile);
        }

        if (this.editingAccount && this.editingAccount.id) {
            // Edit mode
            this.accountService.updateAccount(this.editingAccount.id, formData).subscribe({
                next: () => {
                    this.loadAccounts();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating account', err)
            });
        } else {
            // Create mode
            this.accountService.createAccount(formData).subscribe({
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
