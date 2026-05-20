import { Platform } from 'react-native';
import { Skia } from '@shopify/react-native-skia';

export const skiaAvailable =
  Platform.OS !== 'web' &&
  Skia != null &&
  typeof (Skia as any).RuntimeEffect?.Make === 'function';

function makeEffect(sksl: string) {
  if (!skiaAvailable) return null;
  try { return Skia.RuntimeEffect.Make(sksl) ?? null; } catch { return null; }
}

const FIRE_SKSL = `
uniform float2 iResolution;
uniform float iTime;
half4 main(float2 pos) {
  float2 uv = pos / iResolution;
  float noise = fract(sin(dot(uv * 8.0 + iTime * 0.5, float2(12.9898, 78.233))) * 43758.5453);
  float fire = smoothstep(0.4, 0.9, noise * (1.0 - uv.y));
  return half4(0.827, 0.125, 0.165, fire * 0.85);
}
`;

const WAVES_SKSL = `
uniform float2 iResolution;
uniform float iTime;
half4 main(float2 pos) {
  float2 uv = pos / iResolution - 0.5;
  float dist = length(uv);
  float wave = sin(dist * 20.0 - iTime * 3.0) * 0.5 + 0.5;
  float alpha = smoothstep(0.5, 0.0, dist) * wave;
  return half4(0.055, 0.408, 0.671, alpha);
}
`;

const PARTICLES_SKSL = `
uniform float2 iResolution;
uniform float iTime;
float particle(float2 uv, float2 center, float radius) {
  return smoothstep(radius, 0.0, length(uv - center));
}
half4 main(float2 pos) {
  float2 uv = pos / iResolution;
  float t = iTime * 0.4;
  float p = clamp(
    particle(uv, float2(fract(0.3 + t * 0.7), 1.0 - fract(t * 1.1)),      0.10) +
    particle(uv, float2(fract(0.7 + t * 0.5), 1.0 - fract(t * 0.9 + 0.3)), 0.08) +
    particle(uv, float2(fract(0.5 + t * 0.6), 1.0 - fract(t * 1.3 + 0.6)), 0.06),
    0.0, 1.0);
  return half4(0.0, 0.45, 0.243, p);
}
`;

const NEUTRAL_SKSL = `
uniform float2 iResolution;
uniform float iTime;
half4 main(float2 pos) {
  float2 uv = pos / iResolution;
  float n = fract(sin(dot(uv * 12.0, float2(12.9898, 78.233))) * 43758.5453);
  float v = smoothstep(0.35, 0.85, n);
  return half4(0.65, 0.68, 0.71, v * 0.55);
}
`;

export const fireEffect = makeEffect(FIRE_SKSL);
export const wavesEffect = makeEffect(WAVES_SKSL);
export const particlesEffect = makeEffect(PARTICLES_SKSL);
export const neutralDistortionEffect = makeEffect(NEUTRAL_SKSL);

export type ManaKey = 'incolor' | 'branco' | 'verde' | 'vermelho' | 'preto' | 'azul';

export interface ManaVisualConfig {
  kind: 'shader-animated' | 'shader-static' | 'radial-glow';
  glowColor?: string;
  glowAlpha?: number;
}

export const MANA_VISUAL_STRATEGY: Record<ManaKey, ManaVisualConfig> = {
  vermelho: { kind: 'shader-animated' },
  azul:     { kind: 'shader-animated' },
  verde:    { kind: 'shader-animated' },
  incolor:  { kind: 'shader-static' },
  branco:   { kind: 'radial-glow', glowColor: '#F8F2E2', glowAlpha: 0.85 },
  preto:    { kind: 'radial-glow', glowColor: '#2C1445', glowAlpha: 0.90 },
};
