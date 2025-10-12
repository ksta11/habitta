import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import ScreenVerify from '../../../modules/auth/verify/ScreenVerify';

export default function VerifyPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <ScreenVerify userId={id || ''} />;
}
