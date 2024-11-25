import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { getAuth } from 'firebase/auth';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const currentUser = getAuth().currentUser?.uid;

  useEffect(() => {
    if (currentUser) {
      // A coleção 'notifications' onde guardamos as notificações
      const notificationsRef = collection(db, 'notifications');
      
      // Consultar notificações onde o userId é o usuário atual (quem deve receber)
      const q = query(
        notificationsRef,
        where('toUserId', '==', currentUser), // A notificação deve ser para o usuário atual
        orderBy('timestamp', 'desc')  // Ordenando pela data de criação (timestamp)
      );

      // O onSnapshot vai escutar as mudanças em tempo real
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const notificationsList = [];
        querySnapshot.forEach((doc) => {
          notificationsList.push({ id: doc.id, ...doc.data() });
        });
        setNotifications(notificationsList);
      });

      return () => unsubscribe(); // Limpar a assinatura quando o componente for desmontado
    }
  }, [currentUser]);

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <Text style={styles.notificationText}>{item.message}</Text>
      <Text style={styles.timestampText}>{new Date(item.timestamp.seconds * 1000).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Notificações</Text>
      {notifications.length === 0 ? (
        <Text style={styles.noNotificationsText}>Nenhuma notificação</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          style={styles.notificationList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A1A', paddingTop: 35, paddingHorizontal: 20 },
  headerText: { color: 'white', fontSize: 20, fontFamily: 'Raleway-SemiBold', marginBottom: 20 },
  noNotificationsText: { color: '#A1A0A0', textAlign: 'center', marginTop: 20 },
  notificationList: { flex: 1 },
  notificationContainer: { backgroundColor: '#292929', padding: 15, borderRadius: 10, marginVertical: 8 },
  notificationText: { color: 'white', fontSize: 14 },
  timestampText: { color: '#A1A0A0', fontSize: 12, marginTop: 5 },
});

export default NotificationsScreen;
