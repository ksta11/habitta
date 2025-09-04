import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Label from '../../components/atoms/Label';
import Button from '../../components/atoms/Button';

export default function AppointmentsScreen() {
  
  // Datos simulados de citas
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. García López",
      specialty: "Cardiología",
      date: "2025-09-10",
      time: "10:00 AM",
      status: "confirmada"
    },
    {
      id: 2,
      doctor: "Dra. Martínez",
      specialty: "Dermatología", 
      date: "2025-09-15",
      time: "2:30 PM",
      status: "pendiente"
    }
  ];

  const pastAppointments = [
    {
      id: 3,
      doctor: "Dr. Rodríguez",
      specialty: "Medicina General",
      date: "2025-08-25",
      time: "9:00 AM",
      status: "completada"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Label 
            text="Mis Citas" 
            size="xl" 
            weight="bold"
          />
          <Label 
            text="Gestiona tus citas médicas" 
            size="md" 
            variant="default"
          />
        </View>

        {/* Botón Nueva Cita */}
        <View className="mb-6">
          <Button
            title="Agendar Nueva Cita"
            onPress={() => console.log('Agendar nueva cita')}
            variant="primary"
            size="lg"
          />
        </View>

        {/* Próximas Citas */}
        <View className="mb-6">
          <Label 
            text="Próximas Citas" 
            size="lg" 
            weight="semibold"
          />
          
          {upcomingAppointments.length > 0 ? (
            <View className="mt-3 space-y-3">
              {upcomingAppointments.map((appointment) => (
                <TouchableOpacity 
                  key={appointment.id}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Label 
                        text={appointment.doctor} 
                        size="md" 
                        weight="semibold"
                      />
                      <Label 
                        text={appointment.specialty} 
                        size="sm" 
                        variant="default"
                      />
                    </View>
                    <View className={`px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                      <Label 
                        text={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)} 
                        size="sm"
                        weight="medium"
                      />
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between">
                    <Label 
                      text={`📅 ${appointment.date}`} 
                      size="sm"
                    />
                    <Label 
                      text={`🕐 ${appointment.time}`} 
                      size="sm"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View className="mt-3 bg-white rounded-lg p-6 items-center">
              <Label 
                text="No tienes citas próximas" 
                size="md" 
                variant="default"
              />
            </View>
          )}
        </View>

        {/* Historial de Citas */}
        <View>
          <Label 
            text="Historial" 
            size="lg" 
            weight="semibold"
          />
          
          <View className="mt-3 space-y-3">
            {pastAppointments.map((appointment) => (
              <TouchableOpacity 
                key={appointment.id}
                className="bg-white rounded-lg p-4 shadow-sm opacity-75"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Label 
                      text={appointment.doctor} 
                      size="md" 
                      weight="semibold"
                    />
                    <Label 
                      text={appointment.specialty} 
                      size="sm" 
                      variant="default"
                    />
                  </View>
                  <View className={`px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                    <Label 
                      text={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)} 
                      size="sm"
                      weight="medium"
                    />
                  </View>
                </View>
                
                <View className="flex-row justify-between">
                  <Label 
                    text={`📅 ${appointment.date}`} 
                    size="sm"
                  />
                  <Label 
                    text={`🕐 ${appointment.time}`} 
                    size="sm"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
