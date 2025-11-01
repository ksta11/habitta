import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Plan } from '../../interfaces/property/PropertyInterface';
import formatPlanPrice from '../../utils/format';

type Props = {
  plan: Plan;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'basic' | 'featured' | 'management' | 'integral' | 'default';
  popular?: boolean;
};

export default function PlanCard({ plan, selected, onPress }: Props) {
  // allow optional variant prop or infer from plan name
  const inferVariantFromName = (name?: string) => {
    if (!name) return 'default';
    const n = name.toLowerCase();
    if (n.includes('básic') || n.includes('basico') || n.includes('básico')) return 'basic';
    if (n.includes('destac') || n.includes('destacado')) return 'featured';
    if (n.includes('gest') || n.includes('gestión') || n.includes('gestion')) return 'management';
    if (n.includes('integral')) return 'integral';
    return 'default';
  };

  const colorSchemes = {
    basic: {
      border: 'border-emerald-500',
      bg: 'bg-white',
      accentBg: 'bg-emerald-50',
      accentText: 'text-emerald-600',
      priceText: 'text-emerald-600',
      buttonBg: 'bg-emerald-500',
      buttonText: 'text-white',
    },
    featured: {
      border: 'border-blue-500',
      bg: 'bg-white',
      accentBg: 'bg-blue-50',
      accentText: 'text-blue-600',
      priceText: 'text-blue-600',
      buttonBg: 'bg-blue-500',
      buttonText: 'text-white',
    },
    management: {
      border: 'border-purple-600',
      bg: 'bg-white',
      accentBg: 'bg-purple-50',
      accentText: 'text-purple-600',
      priceText: 'text-purple-600',
      buttonBg: 'bg-purple-600',
      buttonText: 'text-white',
    },
    integral: {
      border: 'border-amber-500',
      bg: 'bg-white',
      accentBg: 'bg-amber-50',
      accentText: 'text-amber-700',
      priceText: 'text-amber-600',
      buttonBg: 'bg-amber-500',
      buttonText: 'text-white',
    },
    default: {
      border: 'border-gray-200',
      bg: 'bg-white',
      accentBg: 'bg-gray-100',
      accentText: 'text-gray-800',
      priceText: 'text-gray-900',
      buttonBg: 'bg-purple-400',
      buttonText: 'text-white',
    },
  } as const;

  // accept variant prop passed via plan (not common) or infer from name
  // @ts-ignore - variant may be provided as prop in some usages
  const propVariant = (plan as any).type as Props['variant'] | undefined;
  const variant: keyof typeof colorSchemes = (propVariant as any) ?? inferVariantFromName(plan.name);
  const colors = colorSchemes[variant] ?? colorSchemes.default;
  const [featuresHeight, setFeaturesHeight] = React.useState<number>(0);
  const COLLAPSED_FEATURES_HEIGHT = 96; // px
  const hasOverflow = featuresHeight > COLLAPSED_FEATURES_HEIGHT;
  const fade = React.useRef(new Animated.Value(!selected && hasOverflow ? 1 : 0)).current;

  React.useEffect(() => {
    const toValue = !selected && hasOverflow ? 1 : 0;
    Animated.timing(fade, { toValue, duration: 220, useNativeDriver: true }).start();
  }, [selected, hasOverflow, fade]);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      className={`relative w-64 p-4 mr-3 rounded-xl ${colors.bg} ${
        selected ? 'shadow-lg border-2' : 'shadow-lg'
      } ${colors.border}`}
    >
      {/* Popular badge */}
      {((plan as any).popular || (false as boolean)) && (
        <View className={`${colors.accentBg} py-2 mx-1 rounded-l-lg rounded-tr-lg absolute -right-1`}>
          <Text className={`${colors.accentText} text-sm font-semibold text-center`}>⭐Más Popular</Text>
        </View>
      )}
      {/* Header: name, description, then price */}
      <View className="mb-2">
        <Text className={`${colors.accentText} text-sm font-semibold uppercase tracking-wide mb-1`}>{plan.name}</Text>
        <Text className="text-gray-600 text-sm mb-2">{(plan as any).description ?? `${plan.duration_days} días`}</Text>

        {/* Price block like subscription-card */}
        <View className="flex-row items-end mb-1">
          <Text className={`${colors.priceText} text-4xl font-bold`}>{formatPlanPrice(plan.price)}</Text>
        </View>
        {(plan as any).priceDetail ? (
          <Text className="text-gray-500 text-sm">{(plan as any).priceDetail}</Text>
        ) : null}
      </View>

      {/* Features: collapsed to fixed height when not selected; show gradient+arrow if overflow */}
      <View className="mt-1">
        <View
          className={`${!selected ? 'relative' : ''}`}
          style={!selected ? { maxHeight: COLLAPSED_FEATURES_HEIGHT, overflow: 'hidden' } : undefined}
        >
          <View
            onLayout={(e) => {
              const h = e.nativeEvent.layout.height;
              if (h && h !== featuresHeight) setFeaturesHeight(h);
            }}
          >
            {String(plan.features || '')
              .split('\n')
              .map((line, idx) =>
                line.trim() ? (
                  <Text key={idx} className="text-sm text-gray-700 mt-1">
                    • {line.trim()}
                  </Text>
                ) : null
              )}
          </View>

          {!selected && hasOverflow ? (
            <View className="absolute left-0 right-0 bottom-0 flex-row items-end justify-end pr-3">
              <LinearGradient
                // top is transparent, bottom is white-ish to mask the content
                colors={["transparent", "rgba(255,255,255,0.85)"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 32 }}
              />
              <Animated.View style={{ opacity: fade }}>
                <MaterialIcons name="keyboard-arrow-down" size={22} color="#6b7280" />
              </Animated.View>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
}