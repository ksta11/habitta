import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import PaymentCard from '../../components/molecules/PaymentCard';
import useViewPayment from './hooks/useViewPayment';


export default function ViewPayments() {
    const { payments, loading, error, reload } = useViewPayment();

    return (
        <View className="flex-1 bg-white-traffic p-4">
            <Text className="text-2xl font-bold mb-4">Mis Pagos</Text>

            {loading && (
                <View className="items-center my-6">
                    <ActivityIndicator size="large" />
                </View>
            )}

            {error && (
                <View className="items-center mb-4">
                    <Text className="text-sm text-red-600">{error}</Text>
                </View>
            )}

            <ScrollView showsVerticalScrollIndicator={false}>
                {payments.map((p) => (
                    <PaymentCard key={p.id_pay} payment={p} />
                ))}
            </ScrollView>
        </View>
    );
}
