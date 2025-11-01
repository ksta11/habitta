import { View, Text, Pressable } from "react-native"

interface SubscriptionCardProps {
  type: "basic" | "featured" | "management" | "integral" | "default"
  name: string
  price: string
  priceDetail: string
  description: string
  features: string[]
  popular?: boolean
}

export default function SubscriptionCard({
  type,
  name,
  price,
  priceDetail,
  description,
  features,
  popular = false,
}: SubscriptionCardProps) {
  // Define color schemes for each plan type
  const colorSchemes = {
    basic: {
      border: "border-emerald-500",
      bg: "bg-white",
      accentBg: "bg-emerald-50",
      accentText: "text-emerald-600",
      priceText: "text-emerald-600",
      buttonBg: "bg-emerald-500",
      buttonText: "text-white",
      iconColor: "text-emerald-500",
      shadow: "shadow-emerald-100",
    },
    featured: {
      border: "border-blue-500",
      bg: "bg-white",
      accentBg: "bg-blue-50",
      accentText: "text-blue-600",
      priceText: "text-blue-600",
      buttonBg: "bg-blue-500",
      buttonText: "text-white",
      iconColor: "text-blue-500",
      shadow: "shadow-blue-100",
    },
    management: {
      border: "border-purple-600",
      bg: "bg-white",
      accentBg: "bg-purple-50",
      accentText: "text-purple-600",
      priceText: "text-purple-600",
      buttonBg: "bg-purple-600",
      buttonText: "text-white",
      iconColor: "text-purple-600",
      shadow: "shadow-purple-100",
    },
    integral: {
      border: "border-amber-500",
      bg: "bg-gradient-to-br from-white to-amber-50",
      accentBg: "bg-amber-50",
      accentText: "text-amber-700",
      priceText: "text-amber-600",
      buttonBg: "bg-amber-500",
      buttonText: "text-white",
      iconColor: "text-amber-600",
      shadow: "shadow-amber-100",
    },
    default: {
      border: "border-purple-400",
      bg: "bg-white",
      accentBg: "bg-purple-50",
      accentText: "text-purple-500",
      priceText: "text-purple-500",
      buttonBg: "bg-purple-400",
      buttonText: "text-white",
      iconColor: "text-purple-400",
      shadow: "shadow-purple-100",
    },
  }

  const colors = colorSchemes[type]

  return (
    <View className={`${colors.bg} rounded-3xl ${colors.border} border-2 overflow-hidden shadow-lg ${colors.shadow}`}>
      {/* Popular Badge */}
      {popular && (
        <View className={`${colors.accentBg} py-2 px-4`}>
          <Text className={`${colors.accentText} text-center font-semibold text-sm`}>⭐ Más Popular</Text>
        </View>
      )}

      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className={`${colors.accentText} text-sm font-semibold uppercase tracking-wide mb-2`}>{name}</Text>
          <Text className="text-gray-600 text-sm mb-4">{description}</Text>

          {/* Price */}
          <View className="flex-row items-end mb-1">
            <Text className={`${colors.priceText} text-5xl font-bold`}>{price}</Text>
          </View>
          <Text className="text-gray-500 text-sm">{priceDetail}</Text>
        </View>

        {/* Features List */}
        <View className="mb-6 gap-3">
          {features.map((feature, index) => (
            <View key={index} className="flex-row items-start">
              <Text className={`${colors.iconColor} text-lg mr-3 mt-0.5`}>✓</Text>
              <Text className="text-gray-700 text-sm flex-1 leading-relaxed">{feature}</Text>
            </View>
          ))}
        </View>

        {/* CTA Button */}
        <Pressable className={`${colors.buttonBg} rounded-xl py-4 px-6 active:opacity-80`}>
          <Text className={`${colors.buttonText} text-center font-semibold text-base`}>Seleccionar Plan</Text>
        </Pressable>
      </View>
    </View>
  )
}
