import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Camera,
  CameraRuntimeError,
  FrameProcessorPerformanceSuggestion,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { TabNavParams } from './RootScreen';
import Reanimated from 'react-native-reanimated';
import { visionCards } from '../frame-processors/visionCards';

// const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
// Reanimated.addWhitelistedNativeProps({ zoom: true });

const ScanScreen = ({}: BottomTabScreenProps<TabNavParams>) => {
  // const camera = useRef<Camera>(null);
  const parentView = useRef<Reanimated.View>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  // const isFocused = useIsFocused();
  // const isActive = isFocused;

  // const onError = useCallback(
  //   (err: CameraRuntimeError) => console.error(err),
  //   []
  // );

  // const onFrameSuggestion = (
  //   suggestion: FrameProcessorPerformanceSuggestion
  // ) => {
  //   suggestion;
  //   // console.log(suggestion);
  // };

  // const frameProcessor = useFrameProcessor((frame) => {
  //   'worklet';
  //   const rectResults = visionCards(frame);
  //   console.log(rectResults.text);
  // }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {device != null && (
        <Reanimated.View ref={parentView} style={StyleSheet.absoluteFill}>
          {/* <ReanimatedCamera
            ref={camera}
            device={device}
            isActive={isActive}
            onError={onError}
            enableZoomGesture={false}
            frameProcessor={
              device?.supportsParallelVideoProcessing
                ? frameProcessor
                : undefined
            }
            frameProcessorFps={6}
            onFrameProcessorPerformanceSuggestionAvailable={onFrameSuggestion}
            orientation="portrait"
            style={StyleSheet.absoluteFill}
            zoom={2}
          /> */}
        </Reanimated.View>
      )}
    </View>
  );
};

export default ScanScreen;
