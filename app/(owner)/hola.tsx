import { View, Text, ScrollView, SafeAreaView } from "react-native"
import SubscriptionCard from "../../components/subscription-card"

export default function SubscriptionPlans() {
  type PlanType = "basic" | "featured" | "management" | "integral" | "default"

  type Plan = {
    id: string
    type: PlanType
    name: string
    price: string
    priceDetail: string
    description: string
    features: string[]
    popular?: boolean
  }

  const plans: Plan[] = [
    {
      id: "basic",
      type: "basic",
      name: "Plan Básico",
      price: "Gratis",
      priceDetail: "Para siempre",
      description: "Ideal para comenzar",
      features: [
        "Publicación de 1 propiedad",
        "Fotos básicas (hasta 5)",
        "Visibilidad estándar",
        "Soporte por email",
        "Panel básico de estadísticas",
      ],
    },
    {
      id: "featured",
      type: "featured",
      name: "Plan Destacado",
      price: "$3",
      priceDetail: "por mes",
      description: "Más visibilidad para tus propiedades",
      features: [
        "Publicación de 5 propiedades",
        "Fotos ilimitadas",
        "Destacado en búsquedas",
        "Soporte prioritario",
        "Análisis avanzado",
        "Badge de verificación",
      ],
      popular: true,
    },
    {
      id: "management",
      type: "management",
      name: "Plan Gestión",
      price: "2.5%",
      priceDetail: "de la renta mensual",
      description: "Gestión profesional completa",
      features: [
        "Propiedades ilimitadas",
        "Gestión de contratos",
        "Cobro automático de rentas",
        "Mantenimiento coordinado",
        "Reportes financieros",
        "Soporte 24/7",
      ],
    },
    {
      id: "integral",
      type: "integral",
      name: "Plan Integral",
      price: "5%",
      priceDetail: "de la renta mensual",
      description: "Servicio premium todo incluido",
      features: [
        "Todo lo del Plan Gestión",
        "Asesoría legal incluida",
        "Seguro de impago",
        "Marketing premium",
        "Gestor personal dedicado",
        "Inspecciones trimestrales",
        "Optimización de precios con IA",
      ],
    },
    {
      id: "default",
      type: "default",
      name: "Plan Personalizado",
      price: "A medida",
      priceDetail: "Contacta con nosotros",
      description: "Solución adaptada a tus necesidades",
      features: [
        "Características personalizadas",
        "Volumen de propiedades flexible",
        "Integraciones a medida",
        "SLA garantizado",
        "Onboarding dedicado",
      ],
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="px-4 py-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">Planes de Suscripción</Text>
          <Text className="text-base text-gray-600 mb-8 text-center">
            Elige el plan perfecto para gestionar tus propiedades
          </Text>

          <View className="gap-6">
            {plans.map((plan) => (
              <SubscriptionCard key={plan.id} {...plan} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
