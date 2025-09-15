import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NotFound: React.FC = () => (
    <View style={styles.container}>
        <Text style={styles.title}>404</Text>
        <Text style={styles.subtitle}>Página no encontrada</Text>
        <TouchableOpacity style={styles.button} onPress={() => {/* Navega al inicio */}}>
            <Text style={styles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 24,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#0070f3',
        borderRadius: 6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default NotFound;