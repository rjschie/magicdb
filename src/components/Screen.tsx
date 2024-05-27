import React from 'react';
import { StyleSheet } from 'react-native';
import {
  SafeAreaView,
  SafeAreaViewProps,
} from 'react-native-safe-area-context';

interface ScreenProps extends SafeAreaViewProps {
  noPadding?: boolean;
  variant?: 'centered';
}

const Screen = ({
  variant,
  noPadding,
  children,
  style,
  ...otherProps
}: ScreenProps) => {
  const localStyle = variant ? variantsSheet[variant] : {};

  return (
    <SafeAreaView
      style={[!noPadding && styleSheet.padding, localStyle, style]}
      {...otherProps}
    >
      {children}
    </SafeAreaView>
  );
};

const variantsSheet = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const styleSheet = StyleSheet.create({
  padding: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default Screen;
