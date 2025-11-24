import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TransaccionServicio, Transaccion } from '../transaccion';
import { AccountService } from '../servicio/account.service';
import { CategoryService } from '../servicio/category.service';
import { Account } from '../servicio/account.interfaces';
import { Category } from '../servicio/category.interfaces';

@Component({
    selector: 'app-transacciones-cuenta',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './transacciones-cuenta.component.html',
    styleUrls: ['./transacciones-cuenta.component.scss']
})
export class TransaccionesCuentaComponent implements OnInit {
    account: Account | null = null;
    transacciones: Transaccion[] = [];
    transaccionesFiltradas: Transaccion[] = [];
    categorias: Category[] = [];

    cargando = true;
    accountId: number = 0;

    // Filtros
    filtros = {
        busqueda: '',
        categoriaId: null as number | null,
        tipoTransaccion: '' as '' | 'INGRESO' | 'GASTO',
        fechaInicio: '',
        fechaFin: ''
    };

    // Ordenamiento
    ordenarPor: 'fecha' | 'monto' | 'categoria' = 'fecha';
    ordenAscendente = false;

    // Paginación
    paginaActual = 1;
    itemsPorPagina = 10;
    totalPaginas = 1;

    constructor(
        private route: ActivatedRoute,
        private transaccionServicio: TransaccionServicio,
        private accountService: AccountService,
        private categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.accountId = +params['id'];
            this.cargarDatos();
        });
    }

    cargarDatos(): void {
        this.cargando = true;

        // Cargar cuenta
        this.accountService.getAccount(this.accountId).subscribe({
            next: (account) => {
                this.account = account;
            },
            error: (err) => console.error('Error cargando cuenta', err)
        });

        // Cargar transacciones
        this.transaccionServicio.obtenerTransaccionesPorCuenta(this.accountId).subscribe({
            next: (transacciones) => {
                this.transacciones = transacciones;
                this.aplicarFiltros();
                this.cargando = false;
            },
            error: (err) => {
                console.error('Error cargando transacciones', err);
                this.cargando = false;
            }
        });

        // Cargar categorías
        this.categoryService.getCategories().subscribe({
            next: (categorias) => {
                this.categorias = categorias;
            },
            error: (err) => console.error('Error cargando categorías', err)
        });
    }

    aplicarFiltros(): void {
        let resultado = [...this.transacciones];

        // Filtro de búsqueda
        if (this.filtros.busqueda) {
            const busqueda = this.filtros.busqueda.toLowerCase();
            resultado = resultado.filter(t =>
                t.descripcion.toLowerCase().includes(busqueda) ||
                t.category_name?.toLowerCase().includes(busqueda)
            );
        }

        // Filtro de categoría
        if (this.filtros.categoriaId) {
            resultado = resultado.filter(t => t.categoria === this.filtros.categoriaId);
        }

        // Filtro de tipo
        if (this.filtros.tipoTransaccion) {
            resultado = resultado.filter(t => t.tipo_transaccion === this.filtros.tipoTransaccion);
        }

        // Filtro de fecha
        if (this.filtros.fechaInicio) {
            resultado = resultado.filter(t => t.fecha >= this.filtros.fechaInicio);
        }
        if (this.filtros.fechaFin) {
            resultado = resultado.filter(t => t.fecha <= this.filtros.fechaFin);
        }

        // Ordenar
        this.ordenarTransacciones(resultado);

        this.transaccionesFiltradas = resultado;
        this.calcularPaginacion();
    }

    ordenarTransacciones(transacciones: Transaccion[]): void {
        transacciones.sort((a, b) => {
            let comparacion = 0;

            switch (this.ordenarPor) {
                case 'fecha':
                    comparacion = new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
                    break;
                case 'monto':
                    comparacion = parseFloat(a.monto) - parseFloat(b.monto);
                    break;
                case 'categoria':
                    comparacion = (a.category_name || '').localeCompare(b.category_name || '');
                    break;
            }

            return this.ordenAscendente ? comparacion : -comparacion;
        });
    }

    cambiarOrden(campo: 'fecha' | 'monto' | 'categoria'): void {
        if (this.ordenarPor === campo) {
            this.ordenAscendente = !this.ordenAscendente;
        } else {
            this.ordenarPor = campo;
            this.ordenAscendente = false;
        }
        this.aplicarFiltros();
    }

    calcularPaginacion(): void {
        this.totalPaginas = Math.ceil(this.transaccionesFiltradas.length / this.itemsPorPagina);
        if (this.paginaActual > this.totalPaginas) {
            this.paginaActual = 1;
        }
    }

    get transaccionesPaginadas(): Transaccion[] {
        const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
        const fin = inicio + this.itemsPorPagina;
        return this.transaccionesFiltradas.slice(inicio, fin);
    }

    cambiarPagina(pagina: number): void {
        if (pagina >= 1 && pagina <= this.totalPaginas) {
            this.paginaActual = pagina;
        }
    }

    limpiarFiltros(): void {
        this.filtros = {
            busqueda: '',
            categoriaId: null,
            tipoTransaccion: '',
            fechaInicio: '',
            fechaFin: ''
        };
        this.aplicarFiltros();
    }

    eliminarTransaccion(id: number): void {
        if (confirm('¿Estás seguro de eliminar esta transacción?')) {
            this.transaccionServicio.borrarTransaccion(id).subscribe({
                next: () => {
                    this.cargarDatos();
                },
                error: (err) => console.error('Error eliminando transacción', err)
            });
        }
    }

    obtenerColorTipo(tipo: string): string {
        return tipo === 'INGRESO' ? 'ingreso' : 'gasto';
    }

    calcularTotalIngresos(): number {
        return this.transaccionesFiltradas
            .filter(t => t.tipo_transaccion === 'INGRESO')
            .reduce((sum, t) => sum + parseFloat(t.monto), 0);
    }

    calcularTotalGastos(): number {
        return this.transaccionesFiltradas
            .filter(t => t.tipo_transaccion === 'GASTO')
            .reduce((sum, t) => sum + parseFloat(t.monto), 0);
    }

    exportarCSV(): void {
        const headers = ['Fecha', 'Descripción', 'Categoría', 'Tipo', 'Monto'];
        const rows = this.transaccionesFiltradas.map(t => [
            t.fecha,
            t.descripcion,
            t.category_name || '',
            t.tipo_transaccion,
            t.monto
        ]);

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transacciones_${this.account?.name}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
