// Input: Remotion Composition API, SelfAssemblyDemo + Branding + TikTokDemo components
// Output: RemotionRoot component registering 4 compositions
// Position: Root component referenced by remotion/index.ts

import React from 'react';
import { Composition } from 'remotion';
import { SelfAssemblyDemo } from './SelfAssemblyDemo';
import { Branding } from './components/Branding';
import { TikTokDemo } from './TikTokDemo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Knot0Demo"
        component={SelfAssemblyDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IncidentResponse"
        component={SelfAssemblyDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="LogoReveal"
        component={Branding}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TikTokDemo"
        component={TikTokDemo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
