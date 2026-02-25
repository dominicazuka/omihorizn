/**
 * Root layout for Expo + React Native app (iOS/Android)
 * Minimal entry point - just plain React Native
 */

import React from 'react';
import { registerRootComponent } from 'expo';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

function NativeApp(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>OmiHorizn</Text>
        <Text style={styles.subtitle}>Study Abroad Made Simple</Text>
      </View>
    </SafeAreaView>
  );
}

registerRootComponent(NativeApp);
