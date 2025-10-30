import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GetUserLegalDocumentsResponse, LegalDocument } from '../../interfaces/LegalDocumentInterface';
import { uploadFileToCloudinary } from '../cloudinary/api-service';

const TOKEN_KEY = '@habitta_token';
const USER_KEY = '@habitta_user';

/**
 * Sube un archivo PDF a Supabase y crea una solicitud de verificación de identidad
 * @param file Objeto con uri, name, mimeType
 * @param documentType Tipo de documento (CC, CE, PP, ...)
 * @param documentNumber Número del documento
 */
export const submitIdentityVerification = async (
	file: { uri: string; name: string; mimeType?: string },
	documentType: string,
	documentNumber: string
) => {
	try {
		console.log('🔁 Iniciando subida de documento para verificación...');

		// Validaciones básicas
		if (!file || !file.uri) {
			return { success: false, message: 'Archivo inválido' };
		}

		// Obtener token
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			return { success: false, message: 'Token de autenticación no encontrado' };
		}

		// Subir a Cloudinary (raw)
		console.log('📤 Subiendo archivo a Cloudinary...');
		const cloudUrl = await uploadFileToCloudinary(file.uri, file.name, file.mimeType);
		if (!cloudUrl) {
			console.error('❌ Cloudinary no está configurado correctamente o la subida falló.');
			return { success: false, message: 'Error al subir archivo: Cloudinary no disponible' };
		}
		const publicUrl = cloudUrl;
		console.log('🔗 Archivo subido a Cloudinary. URL pública:', publicUrl);

		// Preparar payload para el backend
		const description = `${documentType} - ${documentNumber}`;
		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/legal-documents/verify_identity`;

		const resp = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ url_document: publicUrl, description }),
		});

		const body = await resp.json();
		if (!resp.ok) {
			console.error('❌ Error al crear verificación:', body.message);
			return { success: false, statusCode: resp.status, message: body.message || 'Error al enviar verificación' };
		}

		console.log('✅ Verificación enviada correctamente:', body);
		return { success: true, statusCode: resp.status, data: body.data, message: body.message || 'Verificación enviada' };

	} catch (error) {
		console.error('💥 Error en submitIdentityVerification:', error);
		return { success: false, message: error instanceof Error ? error.message : 'Error de conexión' };
	}
};

/**
 * Obtiene los documentos legales asociados al usuario actualmente almacenado en AsyncStorage
 * (se lee `@habitta_user` y se extrae `id`).
 * GET /api/legal-documents/user/:userId
 */
export const getUserLegalDocuments = async (): Promise<GetUserLegalDocumentsResponse> => {
	try {
		let uid: string | undefined;
		const rawUser = await AsyncStorage.getItem(USER_KEY);
		if (rawUser) {
			try {
				const parsed = JSON.parse(rawUser) as { id?: string };
				uid = parsed.id;
			} catch {
				// ignore parse error
			}
		}

		if (!uid) return { success: false, data: [], message: 'userId es requerido' };

		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) return { success: false, data: [], message: 'Token de autenticación no encontrado' };

		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/legal-documents/user/${encodeURIComponent(uid as string)}`;

		const resp = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		});

		const body = await resp.json().catch(() => ({}));
			if (!resp.ok) {
				console.error('❌ Error al obtener documentos legales:', body.message || resp.statusText);
				return { success: false, statusCode: resp.status, data: [], message: body.message || 'Error al obtener documentos' };
			}

			const data: LegalDocument[] = Array.isArray(body.data) ? body.data : [];
			return { success: true, statusCode: resp.status, data, message: body.message ?? null };
	} catch (error) {
		console.error('💥 Error en getUserLegalDocuments:', error);
		return { success: false, data: [], message: error instanceof Error ? error.message : 'Error de conexión' };
	}
};

/**
 * Obtiene los documentos de identidad pendientes (solo para administradores)
 * GET /api/legal-documents/identity_pending
 */
export const getPendingIdentityDocuments = async (): Promise<GetUserLegalDocumentsResponse> => {
	try {
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			return { success: false, data: [], message: 'Token de autenticación no encontrado' };
		}

		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/legal-documents/identity_pending`;

		const resp = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
		});

		const body = await resp.json().catch(() => ({}));
		if (!resp.ok) {
			console.error('❌ Error al obtener documentos de identidad pendientes:', body.message || resp.statusText);
			return { success: false, statusCode: resp.status, data: [], message: body.message || 'Error al obtener documentos pendientes' };
		}

		const data: LegalDocument[] = Array.isArray(body.data) ? body.data : [];
		return { success: true, statusCode: resp.status, data, message: body.message ?? null };
	} catch (error) {
		console.error('💥 Error en getPendingIdentityDocuments:', error);
		return { success: false, data: [], message: error instanceof Error ? error.message : 'Error de conexión' };
	}
};

/**
 * Actualiza un documento legal por administrador (solo status y notes)
 * PUT /api/legal-documents/:id/admin
 */
export const updateDocumentByAdmin = async (
	documentId: string,
	status?: string,
	notes?: string
): Promise<{ success: boolean; data?: any; message?: string; statusCode?: number }> => {
	try {
		const token = await AsyncStorage.getItem(TOKEN_KEY);
		if (!token) {
			return { success: false, message: 'Token de autenticación no encontrado' };
		}

		const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
		const url = `${API_BASE_URL}/api/legal-documents/${encodeURIComponent(documentId)}/admin`;

		const body: any = {};
		if (status !== undefined) body.status = status;
		if (notes !== undefined) body.notes = notes;

		const resp = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify(body),
		});

		const responseBody = await resp.json().catch(() => ({}));
		if (!resp.ok) {
			console.error('❌ Error al actualizar documento:', responseBody.message || resp.statusText);
			return { 
				success: false, 
				statusCode: resp.status, 
				message: responseBody.message || 'Error al actualizar documento' 
			};
		}

		console.log('✅ Documento actualizado correctamente:', responseBody);
		return { 
			success: true, 
			statusCode: resp.status, 
			data: responseBody.data, 
			message: responseBody.message || 'Documento actualizado correctamente' 
		};

	} catch (error) {
		console.error('💥 Error en updateDocumentByAdmin:', error);
		return { success: false, message: error instanceof Error ? error.message : 'Error de conexión' };
	}
};

