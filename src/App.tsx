import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RootScreen from './screens/RootScreen';

export type NavStackParams = {
  Root: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<NavStackParams>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Root">
        <Stack.Screen name="Root" component={RootScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
