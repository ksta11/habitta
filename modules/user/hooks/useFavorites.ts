import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hapticFeedback } from '../../../utils/haptics';

const FAVORITES_STORAGE_KEY = '@habitta_favorites';

/**
 * Hook para manejar favoritos de propiedades
 * Persiste los favoritos en AsyncStorage
 * @returns Estado y funciones para manejar favoritos
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Carga los favoritos desde AsyncStorage
   */
  const loadFavorites = async () => {
    try {
      console.log('⭐ [useFavorites] Cargando favoritos desde AsyncStorage...');
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
        console.log(`✅ [useFavorites] ${parsedFavorites.length} favoritos cargados`);
      } else {
        console.log('ℹ️ [useFavorites] No hay favoritos guardados');
        setFavorites([]);
      }
    } catch (err) {
      console.error('💥 [useFavorites] Error al cargar favoritos:', err);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Guarda los favoritos en AsyncStorage
   */
  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      console.log(`💾 [useFavorites] ${newFavorites.length} favoritos guardados`);
    } catch (err) {
      console.error('💥 [useFavorites] Error al guardar favoritos:', err);
    }
  };

  /**
   * Verifica si una propiedad está en favoritos
   */
  const isFavorite = (propertyId: string): boolean => {
    return favorites.includes(propertyId);
  };

  /**
   * Agrega una propiedad a favoritos
   */
  const addToFavorites = async (propertyId: string) => {
    if (!favorites.includes(propertyId)) {
      const newFavorites = [...favorites, propertyId];
      setFavorites(newFavorites);
      await saveFavorites(newFavorites);
      console.log(`➕ [useFavorites] Propiedad ${propertyId} agregada a favoritos`);
    }
  };

  /**
   * Elimina una propiedad de favoritos
   */
  const removeFromFavorites = async (propertyId: string) => {
    const newFavorites = favorites.filter((id) => id !== propertyId);
    setFavorites(newFavorites);
    await saveFavorites(newFavorites);
    console.log(`➖ [useFavorites] Propiedad ${propertyId} eliminada de favoritos`);
  };

  /**
   * Alterna el estado de favorito de una propiedad
   */
  const toggleFavorite = async (propertyId: string) => {
    // Feedback háptico al toggle de favorito
    hapticFeedback.selection();
    
    if (isFavorite(propertyId)) {
      await removeFromFavorites(propertyId);
    } else {
      await addToFavorites(propertyId);
    }
  };

  /**
   * Limpia todos los favoritos
   */
  const clearFavorites = async () => {
    setFavorites([]);
    await saveFavorites([]);
    console.log('🧹 [useFavorites] Todos los favoritos eliminados');
  };

  /**
   * Obtiene la cantidad de favoritos
   */
  const getFavoritesCount = (): number => {
    return favorites.length;
  };

  // Cargar favoritos al montar el componente
  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    // Estado
    favorites,
    isLoading,

    // Funciones
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,

    // Utilidades
    getFavoritesCount,
  };
};
