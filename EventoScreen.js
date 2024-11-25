import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const EventoScreen = ({ route }) => {
    const { eventId } = route.params; // Pegando o ID do evento passado pela navegação
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Função para buscar o evento no Firestore
    const fetchEvent = async () => {
        try {
            const eventDoc = doc(db, 'eventos', eventId);
            const eventSnap = await getDoc(eventDoc);
            if (eventSnap.exists()) {
                setEvent(eventSnap.data());
            } else {
                console.log('Evento não encontrado.');
            }
        } catch (error) {
            console.error('Erro ao buscar evento:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#9F3EFC" />;
    }

    if (!event) {
        return <Text>Evento não encontrado.</Text>;
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: event.imagem }} style={styles.eventImage} />
            <Text style={styles.eventTitle}>{event.titulo}</Text>
            <Text style={styles.eventDate}>{new Date(event.dataHora.seconds * 1000).toLocaleString()}</Text>
            <View style={styles.containerDescription}>
                <Text style={styles.eventDescription}>
                    {event.descricao}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
    },
    eventImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    eventTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    eventDate: {
        color: '#ddd',
        fontSize: 14,
        marginVertical: 10,
    },
    containerDescription: {
        color: '#aaa',
        fontSize: 16,
        width: '100%',
        paddingTop: 30,
        paddingHorizontal: 15,
        paddingBottom: 20,
        backgroundColor: 'rgba(244, 244, 244, 0.4)', // Opacidade de 0.8
        borderRadius: 20,
    },
    eventDescription :{
        color: '#fff',
        fontFamily: 'Poppins-Regular',

    },
});

export default EventoScreen;
