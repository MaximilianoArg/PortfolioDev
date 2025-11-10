import { Component, OnInit } from '@angular/core';
import { CommonModule, PercentPipe } from '@angular/common';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';
import { RouterModule } from '@angular/router';

// --- Interfaces para una estructura de datos clara ---
interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

interface Asset {
  id: string;
  name: string;
  ticker: string;
  logoUrl?: string; // Opcional, para logos de empresas
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
}

@Component({
  selector: 'app-cartera',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule,
    RouterModule
  ],
  templateUrl: './cartera.html',
  styleUrls: ['./cartera.scss']
})
export class CarteraComponente implements OnInit {

  // --- Propiedades para los datos ---
  summary: PortfolioSummary = { totalValue: 0, totalInvested: 0, totalGainLoss: 0, totalGainLossPercentage: 0 };
  assets: Asset[] = [];
  portfolioHistory: any[] = []; // Para el gráfico

  // --- Propiedades para el gráfico ---
  legendPosition: LegendPosition = LegendPosition.Below;
  colorScheme: any = {
    domain: ['#2c3e50'] // Usa el color oscuro de tu tema para el gráfico
  };

  // --- Propiedades para el modal ---
  isModalOpen = false;

  constructor() { }

  ngOnInit(): void {
    this.loadPortfolioData();
  }

  loadPortfolioData(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO DE BACKEND ---
    this.assets = [
      { id: 'aapl', name: 'Apple Inc.', ticker: 'AAPL', logoUrl: 'https://logo.clearbit.com/apple.com', quantity: 10, averageBuyPrice: 150.75, currentPrice: 185.27 },
      { id: 'tsla', name: 'Tesla, Inc.', ticker: 'TSLA', logoUrl: 'https://logo.clearbit.com/tesla.com', quantity: 5, averageBuyPrice: 220.40, currentPrice: 245.01 },
      { id: 'btc', name: 'Bitcoin', ticker: 'BTC', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg', quantity: 0.1, averageBuyPrice: 30000, currentPrice: 42500 },
      { id: 'eth', name: 'Ethereum', ticker: 'ETH', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg', quantity: 2, averageBuyPrice: 1800, currentPrice: 2300 },
    ];

    // Calculamos los totales y el resumen
    this.calculateSummary();

    // Datos de ejemplo para el gráfico histórico
    this.portfolioHistory = [
      {
        "name": "Valor del Portafolio",
        "series": [
          { "name": "Ene", "value": 6800 },
          { "name": "Mar", "value": 7200 },
          { "name": "May", "value": 6900 },
          { "name": "Jul", "value": 7800 },
          { "name": "Sep", "value": 8500 },
          { "name": "Nov", "value": this.summary.totalValue }
        ]
      }
    ];
  }
  
  calculateSummary(): void {
    this.summary.totalInvested = this.assets.reduce((sum, asset) => sum + (asset.quantity * asset.averageBuyPrice), 0);
    this.summary.totalValue = this.assets.reduce((sum, asset) => sum + (asset.quantity * asset.currentPrice), 0);
    this.summary.totalGainLoss = this.summary.totalValue - this.summary.totalInvested;
    this.summary.totalGainLossPercentage = (this.summary.totalGainLoss / this.summary.totalInvested);
  }

  // --- Helpers para la plantilla (cálculos por activo) ---
  calculateCurrentValue(asset: Asset): number {
    return asset.quantity * asset.currentPrice;
  }

  calculateGainLoss(asset: Asset): number {
    return this.calculateCurrentValue(asset) - (asset.quantity * asset.averageBuyPrice);
  }

  calculateGainLossPercentage(asset: Asset): number {
    const invested = asset.quantity * asset.averageBuyPrice;
    if (invested === 0) return 0;
    return this.calculateGainLoss(asset) / invested;
  }

  // --- Lógica del Modal ---
  openModal(): void { this.isModalOpen = true; }
  closeModal(): void { this.isModalOpen = false; }
}