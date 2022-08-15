/** global __visionCards */

import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;

interface VisionCardsResult {
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
}

export function visionCards(frame: Frame): VisionCardsResult {
  'worklet';
  if (!_WORKLET) {
    throw new Error('VisionCards must be called from a frame processor!');
  }

  // @ts-expect-error
  return __visionCards(frame);
}
