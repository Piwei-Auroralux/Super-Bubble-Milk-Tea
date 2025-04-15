import React from 'react';
import { SafeAreaView, Text, Button, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

export default function App() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>{t('welcome')}</Text>
      <View style={{ flexDirection: 'row', marginTop: 20 }}>
        {['zh', 'en', 'ja', 'ko', 'id', 'es'].map((lang) => (
          <Button key={lang} title={lang.toUpperCase()} onPress={() => i18n.changeLanguage(lang)} />
        ))}
      </View>
    </SafeAreaView>
  );
}
