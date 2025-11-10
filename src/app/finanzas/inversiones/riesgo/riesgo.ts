import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

// --- Interfaces ---
// Reutilizamos la interfaz de Activo, añadiendo el sector
interface Asset {
  id: string;
  name: string;
  ticker: string;
  sector: string; // 'Tecnología', 'Cripto', 'Consumo', etc.
  quantity: number;
  currentPrice: number;
}

interface RiskFactor {
  title: string;
  description: string;
  level: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-riesgo',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './riesgo.html',
  styleUrls: ['./riesgo.scss']
})
export class RiesgoComponente implements OnInit {

  // --- Propiedades para los datos ---
  assets: Asset[] = [];
  totalPortfolioValue: number = 0;
  
  // --- Propiedades para la visualización ---
  riskProfile: string = 'Calculando...';
  riskLevel: number = 0; // Un % para la barra de progreso
  riskFactors: RiskFactor[] = [];
  recommendations: string[] = [];

  // --- Propiedades para los gráficos ---
  assetAllocationData: any[] = [];
  sectorAllocationData: any[] = [];
  
  constructor() { }

  ngOnInit(): void {
    this.loadAndAnalyzePortfolio();
  }

  loadAndAnalyzePortfolio(): void {
    // --- SIMULACIÓN DE LLAMADA A UN SERVICIO ---
    this.assets = [
      { id: 'aapl', name: 'Apple Inc.', ticker: 'AAPL', sector: 'Tecnología', quantity: 10, currentPrice: 185.27 },
      { id: 'tsla', name: 'Tesla, Inc.', ticker: 'TSLA', sector: 'Automotriz', quantity: 5, currentPrice: 245.01 },
      { id: 'btc', name: 'Bitcoin', ticker: 'BTC', sector: 'Criptomoneda', quantity: 0.1, currentPrice: 42500 },
      { id: 'eth', name: 'Ethereum', ticker: 'ETH', sector: 'Criptomoneda', quantity: 2, currentPrice: 2300 },
      { id: 'vti', name: 'Vanguard Total Stock Market ETF', ticker: 'VTI', sector: 'ETF Diversificado', quantity: 15, currentPrice: 220.50 },
    ];
    
    this.totalPortfolioValue = this.assets.reduce((sum, asset) => sum + (asset.quantity * asset.currentPrice), 0);
    
    this.calculateAllocations();
    this.runRiskAnalysis();
  }

  calculateAllocations(): void {
    // 1. Distribución por Activo
    this.assetAllocationData = this.assets.map(asset => ({
      name: asset.ticker,
      value: asset.quantity * asset.currentPrice
    }));

    // 2. Distribución por Sector (agrupando)
    const sectorMap = new Map<string, number>();
    this.assets.forEach(asset => {
      const sectorValue = sectorMap.get(asset.sector) || 0;
      sectorMap.set(asset.sector, sectorValue + (asset.quantity * asset.currentPrice));
    });
    this.sectorAllocationData = Array.from(sectorMap.entries()).map(([name, value]) => ({ name, value }));
  }

  runRiskAnalysis(): void {
    this.riskFactors = [];
    this.recommendations = [];
    let riskScore = 0;

    // Análisis de Concentración por Activo
    const highestAllocation = Math.max(...this.assetAllocationData.map(d => d.value)) / this.totalPortfolioValue;
    if (highestAllocation > 0.40) {
      riskScore += 40;
      this.riskFactors.push({ title: 'Alta Concentración de Activos', description: 'Una gran parte de tu cartera depende de un solo activo.', level: 'high' });
      this.recommendations.push('Considera diversificar añadiendo nuevos activos para reducir la dependencia de uno solo.');
    } else {
      this.riskFactors.push({ title: 'Buena Diversificación de Activos', description: 'Ningún activo individual domina tu cartera.', level: 'low' });
    }

    // Análisis de Concentración por Sector
    const highestSector = Math.max(...this.sectorAllocationData.map(d => d.value)) / this.totalPortfolioValue;
    if (highestSector > 0.50) {
      riskScore += 30;
      this.riskFactors.push({ title: 'Concentración Sectorial', description: 'Tu cartera está muy expuesta a las fluctuaciones de un solo sector.', level: 'medium' });
      this.recommendations.push('Invierte en ETFs o activos de diferentes sectores (financiero, salud, etc.).');
    } else {
      this.riskFactors.push({ title: 'Buena Diversificación Sectorial', description: 'Tu cartera está bien distribuida entre diferentes sectores.', level: 'low' });
    }

    // Análisis de Volatilidad (basado en Cripto)
    const cryptoAllocation = this.sectorAllocationData.find(d => d.name === 'Criptomoneda')?.value || 0;
    const cryptoPercentage = cryptoAllocation / this.totalPortfolioValue;
    if (cryptoPercentage > 0.25) {
      riskScore += 30;
      this.riskFactors.push({ title: 'Alta Exposición a Volatilidad', description: 'Una porción significativa de tu cartera está en activos de alta volatilidad.', level: 'high' });
      this.recommendations.push('Evalúa si tu tolerancia al riesgo se alinea con tu exposición a criptomonedas.');
    } else {
      this.riskFactors.push({ title: 'Exposición a Volatilidad Controlada', description: 'La porción de activos de alta volatilidad es moderada.', level: 'low' });
    }
    
    // Determinar el perfil de riesgo final
    this.riskLevel = Math.min(riskScore, 100);
    if (this.riskLevel > 75) this.riskProfile = 'Muy Agresivo';
    else if (this.riskLevel > 50) this.riskProfile = 'Agresivo';
    else if (this.riskLevel > 25) this.riskProfile = 'Moderado';
    else this.riskProfile = 'Conservador';

    if (this.recommendations.length === 0) {
      this.recommendations.push('¡Excelente trabajo! Tu cartera muestra una buena diversificación y gestión del riesgo.');
    }
  }

  // Helper para los colores de los factores
  getRiskFactorColor(level: 'low' | 'medium' | 'high'): string {
    if (level === 'high') return 'bg-red-100 text-red-700';
    if (level === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }
}