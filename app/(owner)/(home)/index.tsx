import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import PlanSelector from '../../../components/molecules/PlanSelector';
import { Plan } from '../../../interfaces/property/PropertyInterface';
import { getPlans } from '../../../libs/owner/property/api-service';
import ScreenHome from '../../../modules/owner/OwnerHome';

export default function Dashboard() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoadingPlans(true);
        const res = await getPlans();
        if (!mounted) return;
        if (res && res.success) {
          // mark plan with id 2 as popular for demo
          const marked = (res.data || []).map((p) => (p.id === 2 ? { ...p, popular: true } : p));
          setPlans(marked);
        } else {
          console.warn('getPlans failed', res?.message);
        }
      } catch (err) {
        console.error('Error loading plans', err);
      } finally {
        if (mounted) setLoadingPlans(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 justify-center">
        <ScreenHome />

        {/* Prueba: mostrar selector de planes debajo de la pantalla home */}
        <View className="px-4 mt-6">
          <Text className="text-lg font-bold mb-2">Planes (prueba)</Text>
          {loadingPlans ? (
            <Text className="text-sm text-gray-500">Cargando planes...</Text>
          ) : (
            <PlanSelector
              plans={plans}
              onChange={(id) => console.log('Plan seleccionado (prueba):', id)}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

