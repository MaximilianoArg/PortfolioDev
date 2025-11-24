export interface EstadisticasCuenta {
    accountId: number;
    accountName: string;
    totalIngresos: number;
    totalGastos: number;
    balance: number;
    transaccionesCount: number;
    ultimaTransaccion?: Date;
    bank_image?: string;
}

export interface ResumenFinanciero {
    periodo: string;
    cuentas: EstadisticasCuenta[];
    totalGeneral: number;
    gastosGeneral: number;
    ingresosGeneral: number;
}

export interface TransaccionPorCategoria {
    categoriaId: number;
    categoriaNombre: string;
    total: number;
    porcentaje: number;
    transacciones: number;
}

export interface FiltroTransacciones {
    accountId?: number;
    fechaInicio?: string;
    fechaFin?: string;
    categoriaId?: number;
    tipoTransaccion?: 'INGRESO' | 'GASTO';
    busqueda?: string;
}

export interface EstadisticasPeriodo {
    periodo: string;
    ingresos: number;
    gastos: number;
    balance: number;
    transacciones: number;
    categorias: TransaccionPorCategoria[];
}
