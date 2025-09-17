// Interfaces para el sistema de solicitudes de propietarios

export interface SolicitudDocumento {
  id: string;
  tipo: 'dni' | 'pasaporte' | 'certificado_ingresos' | 'declaracion_renta' | 'certificado_bancario' | 'otros';
  nombre: string;
  url: string;
  fecha_subida: string;
  verificado: boolean;
}

export interface SolicitudPropietario {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'documentacion_incompleta';
  fecha_solicitud: string;
  fecha_revision?: string;
  fecha_decision?: string;
  admin_revisor?: string;
  motivo_rechazo?: string;
  comentarios_admin?: string;
  documentos: SolicitudDocumento[];
  informacion_adicional: {
    experiencia_previa: boolean;
    propiedades_a_publicar: number;
    motivo_solicitud: string;
    referencias?: string;
  };
}

export interface SolicitudFilters {
  search: string;
  estado: string;
  fecha_desde: string;
  fecha_hasta: string;
  tipo_documento: string;
  sortBy: 'fecha_solicitud' | 'user_name' | 'estado';
  sortOrder: 'asc' | 'desc';
}

export interface DocumentoVerificacion {
  documento_id: string;
  verificado: boolean;
  comentarios?: string;
  admin_verificador: string;
  fecha_verificacion: string;
}

export interface RespuestaSolicitud {
  solicitud_id: string;
  decision: 'aprobar' | 'rechazar' | 'solicitar_documentos';
  motivo?: string;
  comentarios?: string;
  documentos_faltantes?: string[];
  admin_id: string;
}

// Interfaces para estadísticas de solicitudes
export interface EstadisticasSolicitudes {
  total_solicitudes: number;
  pendientes: number;
  en_revision: number;
  aprobadas: number;
  rechazadas: number;
  documentacion_incompleta: number;
  tiempo_promedio_revision: number; // en días
  tasa_aprobacion: number; // porcentaje
}