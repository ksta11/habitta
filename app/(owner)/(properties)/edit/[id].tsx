import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import ScreenEdit from '../../../../modules/owner/properties/edit/ScreenEdit';

export default function EditPropertyPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ScreenEdit propertyId={id || ''} />;
}
