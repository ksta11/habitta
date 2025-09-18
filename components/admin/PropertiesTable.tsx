import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AdminStatsGrid } from './AdminStatsGrid';
import { AdminProperty, PropertyFilters } from '../../interfaces/PropertyInterface';

// Datos mock de propiedades para administración
const mockProperties: AdminProperty[] = [
  {
    id: '1',
    id_owner: 'owner1',
    title: 'Apartamento Moderno en Madrid Centro',
    description: 'Hermoso apartamento recién renovado con vistas a la Gran Vía',
    address: 'Calle Gran Vía 45, 3º B',
    city: 'Madrid',
    price: 1200,
    type: 'Apartamento',
    rooms: 2,
    bathrooms: 1,
    area: 75,
    services: 'WiFi, Aire acondicionado, Calefacción',
    publication_status: 'published',
    publication_date: '2024-01-15',
    images: [
      { id: '1', id_property: '1', url_image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300' }
    ],
    owner_name: 'María González',
    owner_email: 'maria@email.com',
    status: 'available',
    rental_price: 1200,
    created_at: '2024-01-15',
    updated_at: '2024-03-10',
    views: 245,
    favorites: 18
  },
  {
    id: '2',
    id_owner: 'owner2',
    title: 'Casa Familiar en Barcelona',
    description: 'Espaciosa casa con jardín en zona residencial tranquila',
    address: 'Passeig de Gràcia 125',
    city: 'Barcelona',
    price: 2500,
    type: 'Casa',
    rooms: 4,
    bathrooms: 3,
    area: 180,
    services: 'Jardín, Garaje, Piscina, WiFi',
    publication_status: 'published',
    publication_date: '2024-02-01',
    images: [
      { id: '2', id_property: '2', url_image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300' }
    ],
    owner_name: 'Carlos Rodríguez',
    owner_email: 'carlos@email.com',
    status: 'occupied',
    rental_price: 2500,
    created_at: '2024-02-01',
    updated_at: '2024-03-15',
    views: 189,
    favorites: 31
  },
  {
    id: '3',
    id_owner: 'owner3',
    title: 'Estudio Céntrico Valencia',
    description: 'Perfecto para estudiantes o profesionales jóvenes',
    address: 'Plaza del Ayuntamiento 8, 1º A',
    city: 'Valencia',
    price: 650,
    type: 'Estudio',
    rooms: 1,
    bathrooms: 1,
    area: 35,
    services: 'WiFi, Aire acondicionado',
    publication_status: 'published',
    publication_date: '2024-02-20',
    images: [
      { id: '3', id_property: '3', url_image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300' }
    ],
    owner_name: 'Ana Martínez',
    owner_email: 'ana@email.com',
    status: 'available',
    rental_price: 650,
    created_at: '2024-02-20',
    updated_at: '2024-03-12',
    views: 156,
    favorites: 12
  },
  {
    id: '4',
    id_owner: 'owner4',
    title: 'Ático con Terraza en Sevilla',
    description: 'Exclusivo ático con terraza privada y vistas panorámicas',
    address: 'Calle Sierpes 42, Ático',
    city: 'Sevilla',
    price: 1800,
    type: 'Ático',
    rooms: 3,
    bathrooms: 2,
    area: 120,
    services: 'Terraza, Aire acondicionado, Ascensor, WiFi',
    publication_status: 'published',
    publication_date: '2024-03-01',
    images: [
      { id: '4', id_property: '4', url_image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300' }
    ],
    owner_name: 'Luis Fernández',
    owner_email: 'luis@email.com',
    status: 'maintenance',
    rental_price: 1800,
    created_at: '2024-03-01',
    updated_at: '2024-03-18',
    views: 298,
    favorites: 45
  },
  {
    id: '5',
    id_owner: 'owner5',
    title: 'Loft Industrial Bilbao',
    description: 'Loft de diseño en antiguo edificio industrial rehabilitado',
    address: 'Abandoibarra 15, 2º',
    city: 'Bilbao',
    price: 1400,
    type: 'Loft',
    rooms: 2,
    bathrooms: 2,
    area: 95,
    services: 'Diseño moderno, WiFi, Calefacción, Parking',
    publication_status: 'published',
    publication_date: '2024-03-05',
    images: [
      { id: '5', id_property: '5', url_image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300' }
    ],
    owner_name: 'Carmen López',
    owner_email: 'carmen@email.com',
    status: 'pending',
    rental_price: 1400,
    created_at: '2024-03-05',
    updated_at: '2024-03-20',
    views: 134,
    favorites: 28
  }
];

// Componente Badge para estado
interface BadgeProps {
  status: AdminProperty['status'];
}

const StatusBadge: React.FC<BadgeProps> = ({ status }) => {
  const getStatusConfig = (status: AdminProperty['status']) => {
    switch (status) {
      case 'available':
        return { text: 'Disponible', className: 'bg-green-100 text-green-800' };
      case 'occupied':
        return { text: 'Ocupada', className: 'bg-blue-100 text-blue-800' };
      case 'maintenance':
        return { text: 'Mantenimiento', className: 'bg-yellow-100 text-yellow-800' };
      case 'pending':
        return { text: 'Pendiente', className: 'bg-gray-100 text-gray-800' };
      default:
        return { text: status, className: 'bg-gray-100 text-gray-800' };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <View className={`px-2 py-1 rounded-full ${config.className}`}>
      <Text className={`text-xs font-medium ${config.className.split(' ')[1]}`}>
        {config.text}
      </Text>
    </View>
  );
};

// Componente Badge para tipo de propiedad
interface TypeBadgeProps {
  type: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type }) => {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'apartamento':
        return 'building';
      case 'casa':
        return 'home';
      case 'estudio':
        return 'bed';
      case 'ático':
        return 'star';
      case 'loft':
        return 'industry';
      default:
        return 'building';
    }
  };

  return (
    <View className="flex-row items-center bg-purple-100 px-2 py-1 rounded-full">
      <FontAwesome name={getTypeIcon(type)} size={10} color="#7c3aed" />
      <Text className="text-purple-800 text-xs font-medium ml-1">{type}</Text>
    </View>
  );
};

export const PropertiesTable: React.FC = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    search: '',
    type: 'todos',
    status: 'todos',
    city: 'todos',
    priceRange: { min: 0, max: 5000 },
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  // Estadísticas calculadas
  const propertyStats = useMemo(() => {
    const total = mockProperties.length;
    const available = mockProperties.filter(p => p.status === 'available').length;
    const occupied = mockProperties.filter(p => p.status === 'occupied').length;
    const maintenance = mockProperties.filter(p => p.status === 'maintenance').length;
    const pending = mockProperties.filter(p => p.status === 'pending').length;
    const totalRevenue = mockProperties
      .filter(p => p.status === 'occupied')
      .reduce((sum, p) => sum + p.rental_price, 0);

    return [
      { 
        title: 'Total Propiedades', 
        value: total.toString(), 
        icon: 'building', 
        color: '#3b82f6',
        subtitle: 'Propiedades registradas'
      },
      { 
        title: 'Disponibles', 
        value: available.toString(), 
        icon: 'check-circle', 
        color: '#10b981',
        subtitle: 'Listas para alquilar'
      },
      { 
        title: 'Ocupadas', 
        value: occupied.toString(), 
        icon: 'users', 
        color: '#8b5cf6',
        subtitle: 'Generando ingresos'
      },
      { 
        title: 'Ingresos Mensuales', 
        value: `€${totalRevenue.toLocaleString()}`, 
        icon: 'euro', 
        color: '#f59e0b',
        subtitle: 'De propiedades ocupadas'
      }
    ];
  }, []);

  // Filtrado de propiedades
  const filteredProperties = useMemo(() => {
    let filtered = mockProperties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          property.city.toLowerCase().includes(filters.search.toLowerCase()) ||
                          property.owner_name.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesType = filters.type === 'todos' || property.type === filters.type;
      const matchesStatus = filters.status === 'todos' || property.status === filters.status;
      const matchesCity = filters.city === 'todos' || property.city === filters.city;
      const matchesPrice = property.price >= filters.priceRange.min && 
                          property.price <= filters.priceRange.max;

      return matchesSearch && matchesType && matchesStatus && matchesCity && matchesPrice;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return filters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (filters.sortOrder === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [filters]);

  // Obtener ciudades únicas
  const uniqueCities = useMemo(() => {
    return Array.from(new Set(mockProperties.map(p => p.city)));
  }, []);

  // Obtener tipos únicos
  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(mockProperties.map(p => p.type)));
  }, []);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Gestión de Propiedades
          </Text>
          <Text className="text-gray-600">
            Administra todas las propiedades de la plataforma
          </Text>
        </View>

        {/* Estadísticas */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Estadísticas de Propiedades
          </Text>
          <AdminStatsGrid variant="custom" customStats={propertyStats} />
        </View>

        {/* Filtros */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Filtros y Búsqueda
          </Text>
          
          {/* Barra de búsqueda */}
          <View className="relative mb-4">
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-lg px-10 py-3 text-gray-800"
              placeholder="Buscar por título, ciudad o propietario..."
              value={filters.search}
              onChangeText={(text) => setFilters(prev => ({ ...prev, search: text }))}
            />
            <FontAwesome 
              name="search" 
              size={16} 
              color="#6b7280" 
              style={{ position: 'absolute', left: 12, top: 12 }}
            />
          </View>

          {/* Filtros en grid */}
          <View className="flex-row flex-wrap gap-3">
            {/* Filtro por tipo */}
            <View className="flex-1 min-w-[120px]">
              <Text className="text-sm font-medium text-gray-700 mb-2">Tipo</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <Text className="text-gray-800 text-sm">{filters.type}</Text>
              </View>
            </View>

            {/* Filtro por estado */}
            <View className="flex-1 min-w-[120px]">
              <Text className="text-sm font-medium text-gray-700 mb-2">Estado</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <Text className="text-gray-800 text-sm">{filters.status}</Text>
              </View>
            </View>

            {/* Filtro por ciudad */}
            <View className="flex-1 min-w-[120px]">
              <Text className="text-sm font-medium text-gray-700 mb-2">Ciudad</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <Text className="text-gray-800 text-sm">{filters.city}</Text>
              </View>
            </View>
          </View>

          {/* Botones de filtros rápidos */}
          <View className="flex-row flex-wrap gap-2 mt-4">
            <TouchableOpacity 
              className="bg-blue-100 px-3 py-1 rounded-full"
              onPress={() => setFilters(prev => ({ ...prev, status: 'available' }))}
            >
              <Text className="text-blue-800 text-sm font-medium">Solo Disponibles</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-purple-100 px-3 py-1 rounded-full"
              onPress={() => setFilters(prev => ({ ...prev, status: 'occupied' }))}
            >
              <Text className="text-purple-800 text-sm font-medium">Solo Ocupadas</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-gray-100 px-3 py-1 rounded-full"
              onPress={() => setFilters({
                search: '',
                type: 'todos',
                status: 'todos',
                city: 'todos',
                priceRange: { min: 0, max: 5000 },
                sortBy: 'created_at',
                sortOrder: 'desc'
              })}
            >
              <Text className="text-gray-800 text-sm font-medium">Limpiar Filtros</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Resultados */}
        <View className="bg-white rounded-lg shadow-sm">
          <View className="p-6 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">
                Propiedades ({filteredProperties.length})
              </Text>
              <TouchableOpacity className="bg-black px-4 py-2 rounded-lg">
                <Text className="text-white font-medium">+ Nueva Propiedad</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de propiedades */}
          <View className="p-6">
            {filteredProperties.map((property) => (
              <View key={property.id} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <View className="flex-row">
                  {/* Imagen de la propiedad */}
                  <View className="mr-4">
                    <Image 
                      source={{ uri: property.images[0]?.url_image }}
                      className="w-20 h-20 rounded-lg"
                      resizeMode="cover"
                    />
                  </View>

                  {/* Información principal */}
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 mr-2">
                        <Text className="text-lg font-semibold text-gray-800 mb-1">
                          {property.title}
                        </Text>
                        <View className="flex-row items-center mb-2">
                          <FontAwesome name="map-marker" size={12} color="#6b7280" />
                          <Text className="text-gray-600 text-sm ml-1">
                            {property.city} • {property.address}
                          </Text>
                        </View>
                      </View>
                      <View className="items-end">
                        <Text className="text-xl font-bold text-gray-800">
                          €{property.price.toLocaleString()}
                        </Text>
                        <Text className="text-gray-500 text-sm">por mes</Text>
                      </View>
                    </View>

                    {/* Badges de tipo y estado */}
                    <View className="flex-row items-center mb-3">
                      <TypeBadge type={property.type} />
                      <View className="ml-2">
                        <StatusBadge status={property.status} />
                      </View>
                    </View>

                    {/* Información del propietario y métricas */}
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-1">
                          <FontAwesome name="user" size={12} color="#6b7280" />
                          <Text className="text-gray-600 text-sm ml-1">
                            {property.owner_name}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <FontAwesome name="home" size={12} color="#6b7280" />
                          <Text className="text-gray-600 text-sm ml-1">
                            {property.rooms} hab • {property.bathrooms} baños • {property.area}m²
                          </Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center">
                        <View className="items-center mr-4">
                          <View className="flex-row items-center">
                            <FontAwesome name="eye" size={12} color="#6b7280" />
                            <Text className="text-gray-600 text-xs ml-1">{property.views}</Text>
                          </View>
                          <Text className="text-gray-500 text-xs">vistas</Text>
                        </View>
                        <View className="items-center">
                          <View className="flex-row items-center">
                            <FontAwesome name="heart" size={12} color="#6b7280" />
                            <Text className="text-gray-600 text-xs ml-1">{property.favorites}</Text>
                          </View>
                          <Text className="text-gray-500 text-xs">favoritos</Text>
                        </View>
                      </View>
                    </View>

                    {/* Botones de acción */}
                    <View className="flex-row mt-3 pt-3 border-t border-gray-200">
                      <TouchableOpacity className="bg-blue-100 px-3 py-1 rounded mr-2">
                        <Text className="text-blue-800 text-sm font-medium">Ver Detalles</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="bg-green-100 px-3 py-1 rounded mr-2">
                        <Text className="text-green-800 text-sm font-medium">Editar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="bg-red-100 px-3 py-1 rounded">
                        <Text className="text-red-800 text-sm font-medium">Suspender</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            {filteredProperties.length === 0 && (
              <View className="items-center py-12">
                <FontAwesome name="search" size={48} color="#d1d5db" />
                <Text className="text-gray-500 mt-4 text-center">
                  No se encontraron propiedades
                </Text>
                <Text className="text-gray-400 text-sm text-center mt-2">
                  Prueba ajustando los filtros de búsqueda
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};