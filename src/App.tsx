import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootScreen from './screens/RootScreen';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';
import CardDataDownloader from './screens/CardDataDownloaderScreen';

export type NavStackParams = {
  Root: undefined;
  CardDataDownloader: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<NavStackParams>();

const App = () => {
  const [cameraPermission, setCameraPermission] =
    useState<CameraPermissionStatus>();

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
  }, []);

  console.log(`Re-rendering Navigator. Camera ${cameraPermission}`);

  if (cameraPermission == null) {
    return null; // still loading
  }

  const hasNoDatabase = true;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={hasNoDatabase ? 'CardDataDownloader' : 'Root'}
      >
        <Stack.Screen
          name="CardDataDownloader"
          options={{ headerShown: false }}
          component={CardDataDownloader}
        />
        <Stack.Screen
          name="Root"
          options={{ headerShown: false }}
          component={RootScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
