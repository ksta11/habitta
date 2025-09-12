import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Label from '../../components/atoms/Label';
import Button from '../../components/atoms/Button';

export default function Home() {
  // Datos simulados
  const nextAppointment = {
    doctor: "Dr. García López",
    specialty: "Cardiología",
    date: "2025-09-10",
    time: "10:00 AM"
  };

  const quickActions = [
    { id: 1, title: "Agendar Cita", icon: "📅", color: "bg-blue-100" },
    { id: 2, title: "Mis Recetas", icon: "💊", color: "bg-green-100" },
    { id: 3, title: "Historial", icon: "📋", color: "bg-purple-100" },
    { id: 4, title: "Urgencias", icon: "🚨", color: "bg-red-100" },
  ];

  const recentActivity = [
    { id: 1, title: "Cita completada con Dr. Rodríguez", date: "25 Ago", type: "appointment" },
    { id: 2, title: "Receta actualizada - Ibuprofeno", date: "20 Ago", type: "prescription" },
    { id: 3, title: "Resultado de laboratorio disponible", date: "15 Ago", type: "lab" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header de Bienvenida */}
        <View className="mb-6">
          <Label 
            text="¡Hola, Sebastian!" 
            size="xl" 
            weight="bold"
          />
          <Label 
            text="¿Cómo te sientes hoy?" 
            size="md" 
            variant="default"
          />
        </View>

        {/* Próxima Cita */}
        {nextAppointment && (
          <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
            <View className="flex-row justify-between items-start mb-3">
              <Label 
                text="Próxima Cita" 
                size="lg" 
                weight="semibold"
              />
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Label 
                  text="Confirmada" 
                  size="sm"
                  weight="medium"
                />
              </View>
            </View>
            
            <View className="space-y-2">
              <Label 
                text={nextAppointment.doctor} 
                size="md" 
                weight="medium"
              />
              <Label 
                text={nextAppointment.specialty} 
                size="sm" 
                variant="default"
              />
              <View className="flex-row justify-between mt-2">
                <Label 
                  text={`📅 ${nextAppointment.date}`} 
                  size="sm"
                />
                <Label 
                  text={`🕐 ${nextAppointment.time}`} 
                  size="sm"
                />
              </View>
            </View>
            
            <View className="mt-4">
              <Button
                title="Ver Detalles"
                onPress={() => console.log('Ver detalles de cita')}
                variant="outline"
                size="sm"
              />
            </View>
          </View>
        )}

        {/* Acciones Rápidas */}
        <View className="mb-6">
          <Label 
            text="Acciones Rápidas" 
            size="lg" 
            weight="semibold"
          />
          
          <View className="mt-3 flex-row flex-wrap justify-between">
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                className={`${action.color} rounded-lg p-4 mb-3 items-center`}
                style={{ width: '48%' }}
                onPress={() => console.log(`Acción: ${action.title}`)}
              >
                <View className="text-2xl mb-2">
                  <Label text={action.icon} size="xl" />
                </View>
                <Label 
                  text={action.title} 
                  size="sm" 
                  weight="medium"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Estado de Salud Rápido */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <Label 
            text="Chequeo Rápido" 
            size="lg" 
            weight="semibold"
          />
          
          <View className="mt-3">
            <Label 
              text="¿Cómo te sientes hoy?" 
              size="md" 
              variant="default"
            />
            
            <View className="flex-row justify-between mt-3">
              {['😊', '😐', '😷', '🤒'].map((emoji, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-100 rounded-full p-3 items-center justify-center"
                  style={{ width: 60, height: 60 }}
                  onPress={() => console.log(`Estado: ${emoji}`)}
                >
                  <Label text={emoji} size="xl" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Actividad Reciente */}
        <View>
          <Label 
            text="Actividad Reciente" 
            size="lg" 
            weight="semibold"
          />
          
          <View className="mt-3">
            {recentActivity.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                className="bg-white rounded-lg p-4 mb-3 shadow-sm"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Label 
                      text={activity.title} 
                      size="md" 
                      weight="medium"
                    />
                    <Label 
                      text={activity.date} 
                      size="sm" 
                      variant="default"
                    />
                  </View>
                  <Label text=">" size="lg" variant="default" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}




