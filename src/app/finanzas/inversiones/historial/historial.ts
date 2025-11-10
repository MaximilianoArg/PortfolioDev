import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Interface para una transacción de inversión ---
export interface InvestmentTransaction {
  id: number;
  date: string; // Formato YYYY-MM-DD para ordenar fácilmente
  assetName: string;
  assetTicker: string;
  assetLogoUrl?: string;
  type: 'buy' | 'sell';
  quantity: number;
  pricePerUnit: number;
}

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './historial.html',
  styleUrls: ['./historial.scss']
})
export class HistorialComponente implements OnInit {

  // Propiedad para almacenar las transacciones
  transactions: InvestmentTransaction[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadTransactionHistory();
  }

  loadTransactionHistory(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO DE BACKEND ---
    
    // CORRECCIÓN: Añadimos 'as const' a cada objeto del arreglo
    // para que TypeScript trate sus propiedades como valores literales.
    const transactionData = [
      { id: 1, date: '2025-11-08', assetName: 'Apple Inc.', assetTicker: 'AAPL', assetLogoUrl: 'https://logo.clearbit.com/apple.com', type: 'buy', quantity: 2, pricePerUnit: 185.10 } as const,
      { id: 2, date: '2025-10-25', assetName: 'Ethereum', assetTicker: 'ETH', assetLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg', type: 'buy', quantity: 0.5, pricePerUnit: 2250.45 } as const,
      { id: 3, date: '2025-10-15', assetName: 'Tesla, Inc.', assetTicker: 'TSLA', assetLogoUrl: 'https://logo.clearbit.com/tesla.com', type: 'sell', quantity: 1, pricePerUnit: 255.80 } as const,
      { id: 4, date: '2025-09-30', assetName: 'Bitcoin', assetTicker: 'BTC', assetLogoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg', type: 'buy', quantity: 0.05, pricePerUnit: 40100.00 } as const,
      { id: 5, date: '2025-09-12', assetName: 'Apple Inc.', assetTicker: 'AAPL', assetLogoUrl: 'https://logo.clearbit.com/apple.com', type: 'buy', quantity: 3, pricePerUnit: 175.50 } as const,
    ];

    this.transactions = [...transactionData] // Usamos una copia para mantener la inmutabilidad
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Helper para calcular el valor total de la transacción
  calculateTotalValue(tx: InvestmentTransaction): number {
    return tx.quantity * tx.pricePerUnit;
  }
}