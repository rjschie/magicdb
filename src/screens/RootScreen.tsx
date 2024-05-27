import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { NavStackParams } from '../App';
import HomeScreen from './HomeScreen';
import ScanScreen from './ScanScreen';
import HomeIcon from '../../assets/svg/icons/home.svg';
import ScanIcon from '../../assets/svg/icons/scan-circle.svg';
import HomeIconOutline from '../../assets/svg/icons/home-outline.svg';
import ScanIconOutline from '../../assets/svg/icons/scan-circle-outline.svg';

export type TabNavParams = {
  Home: undefined;
  Scan: undefined;
};

const Tab = createBottomTabNavigator<TabNavParams>();

const ICON_SIZE = 28;

const RootScreen = ({}: NativeStackScreenProps<NavStackParams, 'Root'>) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 88,
        },
        tabBarIconStyle: {
          flex: 0,
          height: ICON_SIZE,
          width: ICON_SIZE,
        },
        tabBarLabelStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <HomeIcon
                width={ICON_SIZE - 2}
                height={ICON_SIZE - 2}
                color={color}
              />
            ) : (
              <HomeIconOutline
                width={ICON_SIZE - 2}
                height={ICON_SIZE - 2}
                color={color}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ color, focused }) => {
            return focused ? (
              <ScanIcon width={ICON_SIZE} height={ICON_SIZE} color={color} />
            ) : (
              <ScanIconOutline
                width={ICON_SIZE}
                height={ICON_SIZE}
                color={color}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default RootScreen;
