// 🌍 Super Bubble Milk Tea - Disaster Aid System (+ Multilingual Disaster Types + Logged Alerts + Alert Feed UI)
// Tech Stack: React Native + i18next + GPS + Firebase Firestore + Maps + Push Notifications + Earthquake Feed

import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import i18n from './locales/i18n';

const db = getFirestore();

const sendAlertNotification = async (customBody, type = 'earthquake') => {
  const messages = {
    earthquake: {
      zh: '📡 最新地震速報，請確認安全位置！',
      en: '📡 Earthquake alert! Please check your safety.',
      ja: '📡 地震速報！安全を確認してください。',
      ko: '📡 지진 경보! 안전을 확인하세요.',
      id: '📡 Peringatan gempa! Periksa keselamatan Anda.',
      es: '📡 ¡Alerta de terremoto! Verifica tu seguridad.'
    },
    flood: {
      zh: '🌊 洪水警報，避免前往低窪地區！',
      en: '🌊 Flood alert. Avoid low-lying areas.',
      ja: '🌊 洪水警報、低地に近づかないでください。',
      ko: '🌊 홍수 경보. 저지대로 가지 마세요.',
      id: '🌊 Peringatan banjir. Hindari daerah rendah.',
      es: '🌊 Alerta de inundación. Evita zonas bajas.'
    },
    landslide: {
      zh: '⛰️ 土石流預警，遠離山區！',
      en: '⛰️ Landslide warning. Stay away from slopes.',
      ja: '⛰️ 土砂災害注意！山を離れてください。',
      ko: '⛰️ 산사태 경고. 산을 멀리하세요.',
      id: '⛰️ Peringatan longsor. Jauhi area perbukitan.',
      es: '⛰️ Alerta de deslizamiento. Aléjate de montañas.'
    },
    tsunami: {
      zh: '🌊 海嘯警報，立即前往高地！',
      en: '🌊 Tsunami alert. Move to high ground!',
      ja: '🌊 津波警報！高台へ避難してください。',
      ko: '🌊 쓰나미 경보. 높은 곳으로 대피하세요!',
      id: '🌊 Peringatan tsunami. Pergi ke tempat tinggi!',
      es: '🌊 Alerta de tsunami. ¡Dirígete a zonas elevadas!'
    }
  };

  const lang = i18n.language || 'zh';
  const msg = messages[type]?.[lang] || messages[type]?.['en'] || customBody;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🚨 災害預警通知",
      body: customBody || msg,
    },
    trigger: null,
  });

  try {
    await addDoc(collection(db, 'alerts'), {
      type,
      lang,
      message: msg,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('❌ 無法記錄通知：', err);
  }
};

export function AlertFeed() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'alerts'), orderBy('timestamp', 'desc'), limit(3));
    const unsub = onSnapshot(q, snapshot => {
      setAlerts(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📢 最近災情通知</Text>
      <ScrollView style={{ width: '100%' }}>
        {alerts.map((alert, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.type}>{alert.type.toUpperCase()} - {new Date(alert.timestamp).toLocaleString()}</Text>
            <Text>{alert.message}</Text>
          </View>
        ))}
        {alerts.length === 0 && <Text>暫無災情通知紀錄</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: '90%',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  card: {
    padding: 10,
    backgroundColor: '#ffeaea',
    borderRadius: 8,
    marginBottom: 10
  },
  type: {
    fontWeight: 'bold',
    marginBottom: 5
  }
});
