import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { TabNavParams } from '../RootScreen';

const ScanScreen = ({}: BottomTabScreenProps<TabNavParams>) => {
  const devices = useCameraDevices();
  const device = devices.back;

  console.log('Device is:', device);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {device != null && (
        <Camera
          device={device}
          isActive={true}
          video={true}
          orientation="portrait"
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
};

export default ScanScreen;
