// Input: remotion registerRoot, Remotion composition registry
// Output: Registered root component with 3 compositions
// Position: Entry point for Remotion studio / render CLI

import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

registerRoot(RemotionRoot);
