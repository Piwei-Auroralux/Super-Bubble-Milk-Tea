import React from 'react';
import { ScrollView, SafeAreaView } from 'react-native';
import {
  AlertFeed,
  SOSHelpForm,
  SOSMap,
  HelpChatBox,
  ShelterRoutePlanner
} from './DisasterAidModule';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <AlertFeed />
        <SOSHelpForm />
        <SOSMap />
        <HelpChatBox />
        <ShelterRoutePlanner />
      </ScrollView>
    </SafeAreaView>
  );
}