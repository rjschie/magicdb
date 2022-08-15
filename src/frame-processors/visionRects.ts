/** global __visionRects */

import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;

interface RectResults {
  rects: Array<{
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    rectPoints: {
      topLeft: { x: number; y: number };
      topRight: { x: number; y: number };
      bottomRight: { x: number; y: number };
      bottomLeft: { x: number; y: number };
    };
  }>;
  text: {
    name: string;
    number: string;
    set: string;
  };
  newFrame: Frame;
}

export function visionRects(frame: Frame): RectResults {
  'worklet';
  if (!_WORKLET) {
    throw new Error('VisionRects must be called from a frame processor!');
  }

  // @ts-expect-error
  return __visionRects(frame);
}
