import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GetUserLegalDocumentsResponse, LegalDocument } from '../../interfaces/LegalDocumentInterface';
import { uploadFileToCloudinary } from '../cloudinary/api-service';

const TOKEN_KEY = '@habitta_token';

/**
 * Sube un documento para una aplicación
 * @param file Objeto con uri, name, mimeType
 * @param applicationId ID de la aplicación
 * @param documentType Tipo de documento
 * @param description Descripción opcional
 */
export const uploadApplicationDocument = async (
	file: { uri: string; name: string; mimeType?: string },
	applicationId: string,
	documentType: string,
	description?: string
) => {
	try {
		console.log('🔁 Iniciando subida de documento para aplicación...');

		if (!file || !file.uri) {
			return { success: false, message: 'Archivo inválido' };
		}

		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			return { success: false, message: 'Token de autenticación no encontrado' };
		}

		// Subir a Cloudinary
		console.log('📤 Subiendo archivo a Cloudinary...');
		const cloudUrl = await uploadFileToCloudinary(file.uri, file.name, file.mimeType);
		if (!cloudUrl) {
			console.error('❌ Cloudinary no está configurado correctamente o la subida falló.');
			return { success: false, message: 'Error al subir archivo: Cloudinary no disponible' };
		}
		console.log('🔗 Archivo subido a Cloudinary. URL pública:', cloudUrl);

		// Enviar al backend
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/legal-documents/application`;

		const resp = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({
				url_document: cloudUrl,
				type: documentType,
				// description: description || documentType,
				belongs_to: 'application',
				id_application: applicationId,
			}),
		});

		const body = await resp.json();
		if (!resp.ok) {
			console.error('❌ Error al guardar documento:', body.message);
			return { success: false, statusCode: resp.status, message: body.message || 'Error al guardar documento' };
		}

		console.log('✅ Documento guardado correctamente:', body);
		return { success: true, statusCode: resp.status, data: body.data, message: body.message || 'Documento guardado' };

	} catch (error) {
		console.error('💥 Error en uploadApplicationDocument:', error);
		return { success: false, message: error instanceof Error ? error.message : 'Error de conexión' };
	}
};

/**
 * Obtiene los documentos de una aplicación
 * GET /api/legal-documents/application/:applicationId
 */
export const getApplicationDocuments = async (applicationId: string): Promise<GetUserLegalDocumentsResponse> => {
	try {
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			return { success: false, data: [], message: 'Token de autenticación no encontrado' };
		}

		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/legal-documents/application/${encodeURIComponent(applicationId)}`;

		const resp = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		});

		const body = await resp.json().catch(() => ({}));
		if (!resp.ok) {
			console.error('❌ Error al obtener documentos de aplicación:', body.message || resp.statusText);
			return { success: false, statusCode: resp.status, data: [], message: body.message || 'Error al obtener documentos' };
		}

		const data: LegalDocument[] = Array.isArray(body.data) ? body.data : [];
		return { success: true, statusCode: resp.status, data, message: body.message ?? null };
	} catch (error) {
		console.error('💥 Error en getApplicationDocuments:', error);
		return { success: false, data: [], message: error instanceof Error ? error.message : 'Error de conexión' };
	}
};
