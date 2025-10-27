import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getPropertyById,
  updateProperty,
} from "../../../libs/owner/property/api-service";
import {
  Property,
  UpdatePropertyDTO,
} from "../../../interfaces/property/PropertyInterface";
import {
  EditPropertySchema,
  EditPropertyFormType,
} from "../../../schemes/PropertySchema";

interface UseEditPropertyReturn {
  // Estado de propiedad
  property: Property | null;
  loading: boolean;

  // React Hook Form
  control: UseFormReturn<EditPropertyFormType>["control"];
  handleSubmit: () => void;
  errors: UseFormReturn<EditPropertyFormType>["formState"]["errors"];
  isSubmitting: boolean;

  // Handlers
  loadProperty: () => Promise<void>;
  handleCancel: () => void;
}

/**
 * 🏠 Hook personalizado para editar una propiedad
 * 
 * Encapsula toda la lógica de:
 * - Carga de datos de la propiedad existente
 * - Populación del formulario con datos actuales
 * - Validación con Zod schema
 * - Actualización de la propiedad
 * - Manejo de estados de loading y errores
 * - Confirmación de cancelación
 * - Navegación de regreso después de guardar
 * 
 * @param {string} propertyId - ID de la propiedad a editar
 * @returns {UseEditPropertyReturn} Objeto con propiedad, control del form y handlers
 * 
 * @example
 * ```tsx
 * const {
 *   property,
 *   loading,
 *   control,
 *   handleSubmit,
 *   errors,
 *   isSubmitting,
 *   handleCancel,
 * } = useEditProperty(propertyId);
 * ```
 */
export const useEditProperty = (propertyId: string): UseEditPropertyReturn => {
  // === ESTADO LOCAL ===
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  // === NAVEGACIÓN ===
  const router = useRouter();

  // === REACT HOOK FORM ===
  const {
    control,
    handleSubmit: rhfHandleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EditPropertyFormType>({
    resolver: zodResolver(EditPropertySchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
      city: "",
      price: 0,
      type: "house",
      rooms: 0,
      bathrooms: 0,
      area: 0,
      services: "",
      publication_status: "published",
      images: [],
    },
  });

  // === FUNCIONES ===

  /**
   * Carga los datos de la propiedad desde el backend
   * - Obtiene la propiedad por ID
   * - Llena el formulario con los datos actuales
   * - Maneja errores y navega de regreso si falla
   */
  const loadProperty = async () => {
    if (!propertyId) {
      Alert.alert("Error", "ID de propiedad no válido");
      router.back();
      return;
    }

    try {
      console.log("🏠 Cargando propiedad con ID:", propertyId);
      const response = await getPropertyById(propertyId);

      if (response.success && response.data) {
        setProperty(response.data);

        // Fill form with property data
        setValue("title", response.data.title);
        setValue("description", response.data.description);
        setValue("address", response.data.address);
        setValue("city", response.data.city);
        setValue("price", response.data.price);
        setValue(
          "type",
          response.data.type as
            | "house"
            | "apartament"
            | "store"
            | "office"
            | "werehouse"
        );
        setValue("rooms", response.data.rooms);
        setValue("bathrooms", response.data.bathrooms);
        setValue("area", response.data.area);
        setValue("services", response.data.services);
        setValue(
          "publication_status",
          response.data.publication_status as "published" | "rented" | "disabled"
        );
        setValue(
          "images",
          response.data.images?.map((img) => ({ url_image: img.url_image })) ||
            []
        );

        console.log(
          "✅ Propiedad cargada exitosamente:",
          response.data.title
        );
      } else {
        console.log("❌ Error al cargar propiedad:", response.message);
        Alert.alert(
          "Error",
          response.message || "No se pudo cargar la propiedad"
        );
        router.back();
      }
    } catch (error) {
      console.error("💥 Error crítico:", error);
      Alert.alert("Error", "Error de conexión al cargar la propiedad");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el submit del formulario
   * - Valida los datos con Zod
   * - Actualiza la propiedad en el backend
   * - Muestra mensaje de éxito/error
   * - Navega de regreso si es exitoso
   */
  const onSubmit = async (data: EditPropertyFormType) => {
    try {
      console.log("📝 Datos del formulario:", data);

      if (!property?.id) {
        Alert.alert("Error", "ID de propiedad no válido");
        return;
      }

      // Preparar datos para la API (agregar id_owner)
      const updateData: UpdatePropertyDTO = {
        ...data,
        id_owner: property.id_owner,
      };

      console.log("🔄 Enviando actualización de propiedad...");
      const response = await updateProperty(property.id, updateData);

      if (response.success) {
        console.log("✅ Propiedad actualizada exitosamente");
        Alert.alert(
          "Éxito",
          response.message || "Los cambios se han guardado correctamente",
          [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        console.log("❌ Error al actualizar:", response.message);
        Alert.alert(
          "Error",
          response.message || "No se pudieron guardar los cambios"
        );
      }
    } catch (error) {
      console.error("💥 Error al guardar:", error);
      Alert.alert("Error", "Hubo un problema al guardar los cambios");
    }
  };

  /**
   * Wrapper del handleSubmit de react-hook-form
   * Permite usarlo directamente en el onPress del botón
   */
  const handleSubmit = () => {
    rhfHandleSubmit(onSubmit)();
  };

  /**
   * Maneja la cancelación de la edición con confirmación
   * - Muestra Alert de confirmación
   * - Navega de regreso si se confirma
   */
  const handleCancel = () => {
    Alert.alert(
      "Cancelar",
      "¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  // === CARGA INICIAL ===
  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  // === RETURN ===
  return {
    // Estado de propiedad
    property,
    loading,

    // React Hook Form
    control,
    handleSubmit,
    errors,
    isSubmitting,

    // Handlers
    loadProperty,
    handleCancel,
  };
};
