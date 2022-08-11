import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    //
  },
});

const Button = ({ children, style, ...otherProps }: PressableProps) => {
  return (
    <Pressable style={[styles.main, style]} {...otherProps}>
      {children}
    </Pressable>
  );
};

export default Button;
