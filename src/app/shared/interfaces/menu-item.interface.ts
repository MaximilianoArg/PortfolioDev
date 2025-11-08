export interface MenuItem {
    icono?: string;
    etiqueta?: string;
    ruta?: string;
    hijo?: MenuItem[];
    estaAbierto?: boolean;
    esCabecera?: boolean;
    activo?: boolean;
    separador?: boolean;
}