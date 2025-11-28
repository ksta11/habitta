import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { ScrollView, View } from 'react-native';
import { Plan } from '../../interfaces/property/PropertyInterface';
import PlanCard from '../atoms/PlanCard';

type Props = {
  plans: Plan[];
  control?: Control<any>;
  name?: string; // p. ej. "id_plan"
  defaultValue?: number | null;
  onChange?: (id: number) => void; // callback opcional
};

function InternalSelector({
  plans,
  value,
  onValueChange,
}: {
  plans: Plan[];
  value?: number | null;
  onValueChange: (id: number) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-3 py-2"
    >
      {plans.map((p) => (
        <View key={p.id} className="mr-3">
          <PlanCard plan={p} selected={value === p.id} onPress={() => onValueChange(p.id)} />
        </View>
      ))}
    </ScrollView>
  );
}

export default function PlanSelector({ plans, control, name, defaultValue = null, onChange }: Props) {
  // initial selected: prefer defaultValue, otherwise first plan
  const initialSelected = defaultValue ?? (plans && plans.length > 0 ? plans[0].id : null);

  // manage selected locally (works for both RHF and non-RHF usage)
  const [selected, setSelected] = useState<number | null>(initialSelected ?? null);

  // keep selected in sync when plans prop changes (pick first if none)
  React.useEffect(() => {
    if ((selected === null || selected === undefined) && plans && plans.length > 0) {
      setSelected(plans[0].id);
      onChange?.(plans[0].id);
    }
  }, [plans]);

  // Si se pasa control+y name -> usa Controller
  if (control && name) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={initialSelected}
        render={({ field: { value, onChange: fieldOnChange } }) => (
          <InternalSelector
            plans={plans}
            value={value ?? selected}
            onValueChange={(id) => {
              // update both form field and local state
              fieldOnChange(id);
              setSelected(id);
              onChange?.(id);
            }}
          />
        )}
      />
    );
  }

  // Modo no-RHF
  return (
    <InternalSelector
      plans={plans}
      value={selected}
      onValueChange={(id) => {
        setSelected(id);
        onChange?.(id);
      }}
    />
  );
}