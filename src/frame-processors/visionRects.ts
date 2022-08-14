/** global __visionRects */

import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;

interface Point {
  x: number;
  y: number;
}

export interface Rect {
  topLeft: Point;
  topRight: Point;
  bottomLeft: Point;
  bottomRight: Point;
}

export function visionRects(frame: Frame): { results: Rect[] } {
  'worklet';
  if (!_WORKLET) {
    throw new Error('VisionRects must be called from a frame processor!');
  }

  // @ts-expect-error
  return __visionRects(frame);
}
