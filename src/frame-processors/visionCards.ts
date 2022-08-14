/** global __visionCards */

import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;

interface VisionCardsResult {
  name: string;
}

export function visionCards(frame: Frame): VisionCardsResult {
  'worklet';
  if (!_WORKLET) {
    throw new Error('VisionCards must be called from a frame processor!');
  }

  // @ts-expect-error
  return __visionCards(frame);
}
