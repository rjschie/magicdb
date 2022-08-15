import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
// import {
//   TapGestureHandler,
//   HandlerStateChangeEvent,
//   TapGestureHandlerEventPayload,
// } from 'react-native-gesture-handler';
import {
  Camera,
  CameraRuntimeError,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';
import { TabNavParams } from '../RootScreen';
import Reanimated from 'react-native-reanimated';
// import Reanimated, {
//   // runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
// } from 'react-native-reanimated';
// import { visionCards } from '../../frame-processors/visionCards';
import { visionRects } from '../../frame-processors/visionRects';

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
  // const boundingBox = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
  // const boundingBoxTwo = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });
  // const [parentViewBoundingBox, setParentViewBoundingBox] = useState({
  //   x: 0,
  //   y: 0,
  //   width: 0,
  //   height: 0,
  //   pageX: 0,
  //   pageY: 0,
  // });

  const onError = useCallback(
    (err: CameraRuntimeError) => console.error(err),
    []
  );

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // const cardResults = visionCards(frame);
    // console.log(cardResults);

    const rectResults = visionRects(frame);
    console.log(rectResults.text);

    // boundingBox.value = rectResults.rects?.[0]?.boundingBox ?? {};
    // boundingBoxTwo.value = rectResults.rects?.[1]?.boundingBox ?? {};
  }, []);

  // const animatedStyleProps = useAnimatedStyle(() => {
  //   const width = boundingBox.value.width * parentViewBoundingBox.width;
  //   const height = boundingBox.value.height * parentViewBoundingBox.height;
  //   const x = boundingBox.value.x * parentViewBoundingBox.width;
  //   const y = (1 - boundingBox.value.y) * parentViewBoundingBox.height;

  //   return {
  //     width,
  //     height,
  //     transform: [{ translateX: x }, { translateY: y - height }],
  //   };
  // }, [boundingBox, parentViewBoundingBox]);

  // const animatedStylePropsTwo = useAnimatedStyle(() => {
  //   const width = boundingBoxTwo.value.width * parentViewBoundingBox.width;
  //   const height = boundingBoxTwo.value.height * parentViewBoundingBox.height;
  //   const x = boundingBoxTwo.value.x * parentViewBoundingBox.width;
  //   const y = (1 - boundingBoxTwo.value.y) * parentViewBoundingBox.height;

  //   return {
  //     width,
  //     height,
  //     transform: [{ translateX: x }, { translateY: y - height }],
  //   };
  // }, [boundingBoxTwo, parentViewBoundingBox]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {device != null && (
        <Reanimated.View
          ref={parentView}
          style={StyleSheet.absoluteFill}
          // onLayout={() => {
          //   parentView.current?.measure((x, y, width, height, pageX, pageY) => {
          //     setParentViewBoundingBox({ x, y, width, height, pageX, pageY });
          //   });
          // }}
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
            zoom={3}
          />
          {/* <Reanimated.View style={[style.box, animatedStyleProps]} />
          <Reanimated.View
            style={[style.box, { borderColor: 'blue' }, animatedStylePropsTwo]}
          /> */}
        </Reanimated.View>
      )}
    </View>
  );
};

// const style = StyleSheet.create({
//   box: {
//     borderColor: 'red',
//     borderWidth: 2,
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: 0,
//     height: 0,
//   },
// });

export default ScanScreen;
