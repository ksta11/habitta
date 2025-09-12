import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AuthGuard } from '../../middleware/AuthGuard';
import Label from '../../components/atoms/Label';
import Button from '../../components/atoms/Button';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export default function UsersManagementScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Aquí harías la llamada a tu API
      // const response = await fetch('/api/users');
      // const data = await response.json();
      // setUsers(data);
      
      // Por ahora, datos de ejemplo
      setUsers([
        { id: '1', name: 'Juan Pérez', email: 'juan@email.com', role: 'user', phone: '123456789' },
        { id: '2', name: 'María García', email: 'maria@email.com', role: 'user', phone: '987654321' },
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <AuthGuard requiredRole="admin">
      <View className="flex-1 bg-gray-50">
        <View className="bg-white p-6 shadow-sm">
          <Label text="Gestión de Usuarios" size="xl" weight="bold" />
          <Label text="Administra los usuarios del sistema" size="md" />
        </View>

        <ScrollView className="flex-1 p-6">
          {loading && (
            <View className="items-center py-8">
              <Label text="Cargando usuarios..." size="md" />
            </View>
          )}

          {users.map((user) => (
            <View key={user.id} className="bg-white p-4 rounded-lg mb-3 shadow-sm">
              <Label text={user.name} size="lg" weight="semibold" />
              <Label text={user.email} size="md" />
              <Label text={`Rol: ${user.role}`} size="sm" />
              {user.phone && <Label text={`Tel: ${user.phone}`} size="sm" />}
            </View>
          ))}
        </ScrollView>
      </View>
    </AuthGuard>
  );
}
