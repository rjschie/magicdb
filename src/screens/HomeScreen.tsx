import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Text, View } from 'react-native';
import { TabNavParams } from './RootScreen';

const HomeScreen = ({}: BottomTabScreenProps<TabNavParams>) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the Home screen</Text>
    </View>
  );
};

export default HomeScreen;
