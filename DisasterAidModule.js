// 🌍 Super Bubble Milk Tea - Disaster Aid System (Full Feature Module)

import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, Button, TextInput, Alert, FlatList } from 'react-native';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import i18n from './locales/i18n';

// Your Firestore instance
const db = getFirestore();

// Notification module (略)

export function AlertFeed() {
  // AlertFeed (略)
}

export function SOSHelpForm() {
  // SOS Form (略)
}

export function SOSMap() {
  // SOSMap (略)
}

function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * (Math.PI / 180);
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function HelpChatBox() {
  // HelpChatBox (略)
}

export function ShelterRoutePlanner() {
  const [location, setLocation] = useState(null);
  const [shelters] = useState([
    { name: '市立體育館避難所', lat: 25.0338, lng: 121.5645 },
    { name: '松山高中操場', lat: 25.0503, lng: 121.5786 },
    { name: '社區活動中心', lat: 25.0385, lng: 121.5307 }
  ]);
  const [closest, setClosest] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [walkTimeMin, setWalkTimeMin] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      let nearest = null;
      let minDist = Infinity;
      shelters.forEach(shelter => {
        const dist = getDistance(loc.coords.latitude, loc.coords.longitude, shelter.lat, shelter.lng);
        if (dist < minDist) {
          minDist = dist;
          nearest = shelter;
        }
      });
      setClosest(nearest);
      setDistanceKm(minDist.toFixed(2));
      setWalkTimeMin(Math.round((minDist / 5) * 60));
    })();
  }, []);

  return (
    <View style={styles.mapBox}>
      <Text style={styles.title}>🧭 最近避難所導引</Text>
      {location && closest ? (
        <>
        <MapView
          style={{ width: '100%', height: 200 }}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
          }}
        >
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} title="你的位置" />
          <Marker coordinate={{ latitude: closest.lat, longitude: closest.lng }} title={closest.name} pinColor="blue" />
          <Polyline
            coordinates={[
              { latitude: location.latitude, longitude: location.longitude },
              { latitude: closest.lat, longitude: closest.lng }
            ]}
            strokeColor="#1E90FF"
            strokeWidth={4}
          />
        </MapView>
        <Text style={{ marginTop: 10 }}>
          📏 距離最近避難所約 {distanceKm} 公里，步行約需 {walkTimeMin} 分鐘
        </Text>
        </>
      ) : (
        <Text>正在尋找最近避難所...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapBox: {
    marginTop: 30,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  }
});
