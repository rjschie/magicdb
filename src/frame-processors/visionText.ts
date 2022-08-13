/** global __visionText */

import type { Frame } from 'react-native-vision-camera';

declare let _WORKLET: true | undefined;

export function visionText(frame: Frame): string[] {
  'worklet';
  if (!_WORKLET) {
    throw new Error('VisionText must be called from a frame processor!');
  }

  // @ts-expect-error
  return __visionText(
    frame,
    'hello!',
    'param2',
    true,
    42,
    { test: 0, second: 'test' },
    ['another test', 5]
  );
}
