import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  HandlerStateChangeEvent,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  Camera,
  CameraRuntimeError,
  FrameProcessorPerformanceSuggestion,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { TabNavParams } from '../RootScreen';
import Reanimated from 'react-native-reanimated';
import { visionText } from '../../frame-processors/visionText';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const ScanScreen = ({}: BottomTabScreenProps<TabNavParams>) => {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const isFocused = useIsFocused();
  const isActive = isFocused;
  // const zoom = useSharedValue(device?.neutralZoom ?? 0);

  const onError = useCallback(
    (err: CameraRuntimeError) => console.error(err),
    []
  );

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const values = visionText(frame);
    console.log(`Return values: ${JSON.stringify(values)}`);
  }, []);

  const onFrameProcessorSuggestion = useCallback(
    (suggestion: FrameProcessorPerformanceSuggestion) => {
      console.log(
        `Suggestion available! ${suggestion.type}: Can do ${suggestion.suggestedFrameProcessorFps} fps`
      );
    },
    []
  );

  const onSingleTap = useCallback(
    async (event: HandlerStateChangeEvent<TapGestureHandlerEventPayload>) => {
      console.log('tapping');
      if (device?.supportsFocus) {
        console.log('Focusing!');

        await camera.current?.focus({
          x: event.nativeEvent.x,
          y: event.nativeEvent.y,
        });
      }
    },
    []
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {device != null && (
        <Reanimated.View style={StyleSheet.absoluteFill}>
          <TapGestureHandler
            onHandlerStateChange={onSingleTap}
            numberOfTaps={1}
          >
            <ReanimatedCamera
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
              frameProcessorFps={1}
              onFrameProcessorPerformanceSuggestionAvailable={
                onFrameProcessorSuggestion
              }
              orientation="portrait"
              style={StyleSheet.absoluteFill}
            />
          </TapGestureHandler>
        </Reanimated.View>
      )}
    </View>
  );
};

export default ScanScreen;
