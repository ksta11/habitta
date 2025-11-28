import React from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import PaymentCard from '../../components/molecules/PaymentCard';
import useViewPayment from './hooks/useViewPayment';


export default function ViewPayments() {
    const { payments, loading, error, reload } = useViewPayment();
    const [refreshing, setRefreshing] = React.useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await reload();
        setRefreshing(false);
    };

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

            <FlatList
                data={payments}
                keyExtractor={(item) => item.id_pay}
                renderItem={({ item }) => <PaymentCard payment={item} />}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                contentContainerStyle={{ paddingBottom: 16 }}
                ListEmptyComponent={
                    !loading ? (
                        <View className="items-center justify-center py-12">
                            <Text className="text-gray-500">No tienes pagos registrados</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
}
