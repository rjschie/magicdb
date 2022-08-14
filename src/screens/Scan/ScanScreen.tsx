import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  HandlerStateChangeEvent,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { TabNavParams } from '../RootScreen';
import Reanimated from 'react-native-reanimated';
import { visionCards } from '../../frame-processors/visionCards';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const ScanScreen = ({}: BottomTabScreenProps<TabNavParams>) => {
  const camera = useRef<Camera>(null);
  const parentView = useRef<Reanimated.View>(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const isFocused = useIsFocused();
  const isActive = isFocused;
  const [, setParentViewBoundingBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    pageX: 0,
    pageY: 0,
  });

  const onError = useCallback(
    (err: CameraRuntimeError) => console.error(err),
    []
  );

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const cardResults = visionCards(frame);

    console.log(cardResults);
  }, []);

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
        <Reanimated.View
          ref={parentView}
          style={StyleSheet.absoluteFill}
          onLayout={() => {
            parentView.current?.measure((x, y, width, height, pageX, pageY) => {
              setParentViewBoundingBox({ x, y, width, height, pageX, pageY });
            });
          }}
        >
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
              orientation="portrait"
              style={StyleSheet.absoluteFill}
              zoom={2}
            />
          </TapGestureHandler>
        </Reanimated.View>
      )}
    </View>
  );
};

export default ScanScreen;
