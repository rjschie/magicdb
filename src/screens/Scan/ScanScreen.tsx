import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  HandlerStateChangeEvent,
  // PinchGestureHandler,
  // PinchGestureHandlerGestureEvent,
  TapGestureHandler,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  Camera,
  // CameraProps,
  CameraRuntimeError,
  useCameraDevices,
} from 'react-native-vision-camera';
import { TabNavParams } from '../RootScreen';
import Reanimated from 'react-native-reanimated';
// import Reanimated, {
//   Extrapolate,
//   interpolate,
//   useAnimatedGestureHandler,
//   useAnimatedProps,
//   useSharedValue,
// } from 'react-native-reanimated';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

// const SCALE_FULL_ZOOM = 35;
// const MAX_ZOOM_FACTOR = 20;

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

  // const minZoom = device?.minZoom ?? 0;
  // const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);
  // const onPinchGesture = useAnimatedGestureHandler<
  //   PinchGestureHandlerGestureEvent,
  //   { startZoom?: number }
  // >({
  //   onStart: (_, context) => {
  //     context.startZoom = zoom.value;
  //   },
  //   onActive: (event, context) => {
  //     const startZoom = context.startZoom ?? 0;
  //     const scale = interpolate(
  //       event.scale,
  //       [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM],
  //       [-1, 0, 1],
  //       Extrapolate.CLAMP
  //     );
  //     zoom.value = interpolate(
  //       scale,
  //       [-1, 0, 1],
  //       [minZoom, startZoom, maxZoom],
  //       Extrapolate.CLAMP
  //     );
  //   },
  // });

  // const cameraAnimatedProps = useAnimatedProps<Partial<CameraProps>>(() => {
  //   console.log('animating prop', zoom.value);
  //   const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
  //   return {
  //     zoom: z,
  //   };
  // }, [maxZoom, minZoom, zoom]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {device != null && (
        // <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
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
              // animatedProps={cameraAnimatedProps}
              orientation="portrait"
              style={StyleSheet.absoluteFill}
            />
          </TapGestureHandler>
        </Reanimated.View>
        // </PinchGestureHandler>
      )}
    </View>
  );
};

export default ScanScreen;
