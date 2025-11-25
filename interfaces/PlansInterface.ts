// Tipos e interfaces para los planes
export interface Plan {
  id: string;
  name: string;
  price: string;
  priceNumeric: number;
  duration: string;
  description: string;
  color: string;
  gradient: [string, string];
  icon: string;
  features: string[];
  notIncluded: string[];
  hasInsurance: boolean;
  insuranceType?: 'optional' | 'included';
  insuranceNote?: string;
  recommended?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Plan Básico',
    price: 'Gratis',
    priceNumeric: 0,
    duration: '15 días',
    description: 'Ideal para propietarios ocasionales',
    color: '#9333EA',
    gradient: ['#9333EA', '#7C3AED'],
    icon: 'home-outline',
    features: [
      'Publicación gratuita de propiedades',
      'Duración limitada de 15 días',
      'Visibilidad estándar en los listados',
      'Ideal para propietarios ocasionales',
    ],
    notIncluded: [
      'Destacados',
      'Estadísticas',
      'Gestión de pagos',
      'Verificación de inquilinos',
      'Soporte técnico',
      'Seguro',
      'Coordinación de mantenimientos',
    ],
    hasInsurance: false,
  },
  {
    id: 'featured',
    name: 'Plan Destacado',
    price: '$11.900',
    priceNumeric: 11900,
    duration: '30 días',
    description: 'Mayor visibilidad para tu propiedad',
    color: '#7C3AED',
    gradient: ['#7C3AED', '#6D28D9'],
    icon: 'star-outline',
    features: [
      'Publicación sin límite de tiempo',
      'Propiedad destacada en búsquedas y recomendaciones',
      'Estadísticas básicas de interacción (visitas y clics)',
      'Permanece hasta concretar arriendo',
    ],
    notIncluded: [
      'Verificación de inquilinos',
      'Gestión de pagos',
      'Soporte técnico',
      'Mantenimientos',
      'Seguro',
    ],
    hasInsurance: false,
    recommended: true,
  },
  {
    id: 'management',
    name: 'Plan Gestión',
    price: '2.5%',
    priceNumeric: 2.5,
    duration: '30 días',
    description: 'Gestión completa de tu arriendo',
    color: '#6D28D9',
    gradient: ['#6D28D9', '#5B21B6'],
    icon: 'briefcase-outline',
    features: [
      'Todo lo del Plan Destacado',
      'Verificación de antecedentes del inquilino',
      'Gestión de pagos: recordatorios, conciliación y seguimiento',
      'Soporte técnico remoto',
      'Opción de contratar seguro externo',
    ],
    notIncluded: [
      'Coordinación de mantenimientos',
      'Atención presencial',
      'Estadísticas avanzadas',
    ],
    hasInsurance: true,
    insuranceType: 'optional',
    insuranceNote: 'El seguro es provisto por una aseguradora externa. Habitta solo actúa como puente para facilitar la contratación. Todo lo relacionado con coberturas, reclamaciones y exclusiones depende 100% del proveedor.',
  },
  {
    id: 'integral',
    name: 'Plan Integral',
    price: '5%',
    priceNumeric: 5,
    duration: '30 días',
    description: 'Servicio completo todo incluido',
    color: '#5B21B6',
    gradient: ['#5B21B6', '#4C1D95'],
    icon: 'shield-checkmark-outline',
    features: [
      'Todo lo del Plan Gestión',
      'Coordinación y seguimiento de mantenimientos',
      'Atención presencial en caso de emergencias',
      'Estadísticas avanzadas (comparación de precios, proyección de ingresos)',
      'Reportes detallados',
      'Seguro para imprevistos incluido (pagado por Habitta)',
    ],
    notIncluded: [],
    hasInsurance: true,
    insuranceType: 'included',
    insuranceNote: 'El seguro es proporcionado por un tercero asegurador. Habitta cubre el costo mensual, pero la aseguradora define coberturas, exclusiones, montos máximos y reglas de reclamación. Habitta no interviene en decisiones del asegurador.',
  },
];

export const INSURANCE_TERMS = `El seguro ofrecido en este plan es proporcionado por un tercero asegurador, cuyas coberturas, requisitos, procesos y exclusiones se rigen exclusivamente por sus propios términos y condiciones.

Habitta actúa únicamente como intermediador tecnológico y no interviene en la aprobación de reclamaciones ni asume responsabilidad por la gestión o cobertura del seguro.

Todas las decisiones sobre reclamaciones y montos cubiertos pertenecen únicamente a la compañía aseguradora aliada.

Habitta no garantiza ni se hace responsable por:
• La aprobación de reclamaciones
• Los montos cubiertos por el seguro
• Los tiempos de respuesta de la aseguradora
• Las exclusiones o limitaciones establecidas por el proveedor
• Cualquier controversia derivada de la póliza de seguro

Para más información sobre las coberturas específicas, términos y condiciones del seguro, el usuario deberá contactar directamente con la compañía aseguradora.`;
