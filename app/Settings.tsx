import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from 'expo-router';
import { colors } from './design';

export default function SettingsScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Settings',
      headerStyle: { backgroundColor: colors.warmCream },
      headerShadowVisible: false,
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.warmCream }}>
      <Text variant="headlineMedium">Settings Screen</Text>
    </View>
  );
}
