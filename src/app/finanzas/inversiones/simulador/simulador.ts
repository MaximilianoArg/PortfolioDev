import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule, LegendPosition } from '@swimlane/ngx-charts';

// --- Interface para la configuración del gráfico ---
interface ChartDataPoint {
  name: string; // Año
  value: number; // Valor de la cartera
}

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  templateUrl: './simulador.html',
  styleUrls: ['./simulador.scss']
})
export class SimuladorComponente implements OnInit {

  // --- Propiedades para el formulario de simulación ---
  simulationForm: FormGroup;

  // --- Propiedades para los resultados ---
  simulationResults: any[] = []; // Datos para el gráfico
  finalValue: number = 0;
  totalContributions: number = 0;
  totalInterest: number = 0;
  public legendPosition: LegendPosition = LegendPosition.Below;

  // --- Propiedades para el gráfico ---
  colorScheme: any = {
    domain: ['#10B981', '#2c3e50'] // Verde para el interés, oscuro para las contribuciones
  };

  constructor() {
    // Inicializamos el formulario con valores por defecto
    this.simulationForm = new FormGroup({
      initialInvestment: new FormControl(10000),
      monthlyContribution: new FormControl(500),
      years: new FormControl(20),
      annualReturn: new FormControl(8), // Rendimiento anual esperado en %
    });
  }

  ngOnInit(): void {
    // Generamos la simulación inicial al cargar el componente
    this.runSimulation();

    // Nos suscribimos a los cambios en el formulario para re-calcular en tiempo real
    this.simulationForm.valueChanges.subscribe(() => {
      this.runSimulation();
    });
  }

  runSimulation(): void {
    const { initialInvestment, monthlyContribution, years, annualReturn } = this.simulationForm.value;
    const rate = annualReturn / 100;
    
    let futureValue = initialInvestment;
    let totalContributions = initialInvestment;
    const resultsData: ChartDataPoint[] = [{ name: 'Año 0', value: initialInvestment }];

    for (let i = 1; i <= years; i++) {
      // Aplicamos el interés compuesto anual
      futureValue *= (1 + rate);
      // Añadimos las contribuciones anuales
      futureValue += monthlyContribution * 12;
      totalContributions += monthlyContribution * 12;
      resultsData.push({ name: `Año ${i}`, value: parseFloat(futureValue.toFixed(2)) });
    }
    
    // Actualizamos las propiedades para la vista
    this.finalValue = futureValue;
    this.totalContributions = totalContributions;
    this.totalInterest = futureValue - totalContributions;

    // Formateamos los datos para el gráfico de área apilado
    this.simulationResults = this.generateStackedChartData(resultsData, initialInvestment, monthlyContribution);
  }

  // Genera los datos para un gráfico de área apilado, mostrando contribuciones vs. interés
  generateStackedChartData(data: ChartDataPoint[], initial: number, monthly: number): any[] {
    const principalSeries: ChartDataPoint[] = [];
    const interestSeries: ChartDataPoint[] = [];

    data.forEach((point, index) => {
      const year = index;
      const principalValue = initial + (monthly * 12 * year);
      const interestValue = point.value - principalValue;

      principalSeries.push({ name: point.name, value: principalValue });
      interestSeries.push({ name: point.name, value: interestValue });
    });

    return [
      { name: 'Interés Ganado', series: interestSeries },
      { name: 'Contribuciones', series: principalSeries },
    ];
  }

}