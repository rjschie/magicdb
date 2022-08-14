/** global __visionText */

import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;

export function visionText(frame: Frame): {
  results: Array<{ candidates: string[] }>;
} {
  'worklet';
  if (!_WORKLET) {
    throw new Error('VisionText must be called from a frame processor!');
  }

  // @ts-expect-error
  return __visionText(frame);
}
