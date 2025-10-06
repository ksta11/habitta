
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNotification } from '../../contexts/NotificationContext';

export default function NotificationScreen() {
	const { expoPushToken, notification, error } = useNotification();

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Depuración de Notificaciones</Text>
			<Text style={styles.label}>Push Token:</Text>
			<Text selectable style={styles.token}>{expoPushToken || 'No disponible'}</Text>
			<Text style={styles.label}>Última notificación recibida:</Text>
			{notification ? (
				<View style={styles.notificationBox}>
					<Text style={styles.notificationTitle}>{notification.request.content.title}</Text>
					<Text>{notification.request.content.body}</Text>
					<Text style={styles.notificationData}>{JSON.stringify(notification.request.content.data, null, 2)}</Text>
				</View>
			) : (
				<Text style={styles.noNotification}>No se ha recibido ninguna notificación aún.</Text>
			)}
			{error && (
				<Text style={styles.error}>Error: {error.message}</Text>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		padding: 24,
		backgroundColor: '#fff',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
	},
	title: {
		fontSize: 22,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	label: {
		fontWeight: 'bold',
		marginTop: 12,
	},
	token: {
		fontSize: 12,
		color: '#333',
		marginBottom: 8,
	},
	notificationBox: {
		backgroundColor: '#F3F4F6',
		borderRadius: 8,
		padding: 12,
		marginTop: 8,
		width: '100%',
	},
	notificationTitle: {
		fontWeight: 'bold',
		fontSize: 16,
		marginBottom: 4,
	},
	notificationData: {
		fontSize: 12,
		color: '#666',
		marginTop: 4,
	},
	noNotification: {
		color: '#888',
		fontStyle: 'italic',
		marginTop: 8,
	},
	error: {
		color: 'red',
		marginTop: 16,
	},
});
