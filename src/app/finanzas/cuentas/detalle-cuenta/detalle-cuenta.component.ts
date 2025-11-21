import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../servicio/account.service';
import { Account, Credit } from '../../servicio/account.interfaces';

@Component({
    selector: 'app-detalle-cuenta',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './detalle-cuenta.component.html',
    styleUrls: ['./detalle-cuenta.component.scss']
})
export class DetalleCuentaComponent implements OnInit {
    account: Account | null = null;
    credits: Credit[] = [];
    accountId: number = 0;

    showCreditModal = false;
    editingCredit: Credit | null = null;
    newCredit: Partial<Credit> = {
        name: '',
        total_amount: 0,
        remaining_amount: 0,
        interest_rate: 0,
        total_installments: 1,
        installments_paid: 0,
        is_paid: false
    };

    constructor(
        private route: ActivatedRoute,
        private accountService: AccountService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.accountId = +params['id'];
            this.loadAccountDetails();
        });
    }

    loadAccountDetails(): void {
        this.accountService.getAccount(this.accountId).subscribe({
            next: (data) => {
                this.account = data;
                this.credits = data.credits || [];
            },
            error: (err) => console.error('Error loading account details', err)
        });
    }

    openCreditModal(): void {
        this.showCreditModal = true;
        this.editingCredit = null;
        this.newCredit = { name: '', total_amount: 0, remaining_amount: 0, interest_rate: 0, total_installments: 1, installments_paid: 0, is_paid: false };
    }

    editCredit(credit: Credit): void {
        this.editingCredit = credit;
        this.newCredit = { ...credit };
        this.showCreditModal = true;
    }

    closeModal(): void {
        this.showCreditModal = false;
        this.editingCredit = null;
    }

    saveCredit(): void {
        if (this.editingCredit) {
            // Update
            if (this.editingCredit.id) {
                this.accountService.updateCredit(this.editingCredit.id, this.newCredit).subscribe({
                    next: () => {
                        this.loadAccountDetails();
                        this.closeModal();
                    },
                    error: (err) => console.error('Error updating credit', err)
                });
            }
        } else {
            // Create
            this.accountService.createCredit(this.accountId, this.newCredit).subscribe({
                next: () => {
                    this.loadAccountDetails();
                    this.closeModal();
                },
                error: (err) => console.error('Error creating credit', err)
            });
        }
    }

    deleteCredit(id: number): void {
        if (confirm('¿Estás seguro de eliminar este crédito?')) {
            this.accountService.deleteCredit(id).subscribe({
                next: () => this.loadAccountDetails(),
                error: (err) => console.error('Error deleting credit', err)
            });
        }
    }
}
