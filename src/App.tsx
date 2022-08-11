import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootScreen from './screens/RootScreen';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';

export type NavStackParams = {
  Root: undefined;
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

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Root">
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
