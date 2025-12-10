import {
  WaveType,
  WaveDirection,
  ThumbShape,
  SliderOrientation,
  WaveConfig,
  TrackConfig,
  ThumbConfig,
  GapConfig,
  AnimationConfig,
  ThemeConfig,
  AccessibilityConfig,
} from './WavySlider.types';

// ============================================
// DEFAULT CONFIGURATIONS
// ============================================

export const DEFAULT_WAVE_CONFIG: Required<WaveConfig> = {
  type: WaveType.SINE,
  amplitude: 8,
  frequency: 0.1,
  wavelength: 0, // 0 means use frequency instead
  speed: 0.08,
  direction: WaveDirection.LEFT,
  thickness: 4,
  resolution: 2,
  cycles: 0, // 0 means use frequency instead
  phaseOffset: 0,
};

export const DEFAULT_TRACK_CONFIG: Required<TrackConfig> = {
  thickness: 4,
  borderRadius: 2,
  height: 4,
  showBackground: false,
  backgroundColor: 'rgba(255,255,255,0.1)',
  backgroundOpacity: 1,
};

export const DEFAULT_THUMB_CONFIG: Required<ThumbConfig> = {
  visible: true,
  shape: ThumbShape.ROUNDED_RECT,
  width: 5,
  height: 24,
  borderRadius: 2,
  scaleOnDrag: 1.2,
  opacityOnDrag: 1,
  borderWidth: 0,
  borderColor: 'transparent',
  shadow: {
    enabled: false,
    color: 'rgba(0,0,0,0.3)',
    offset: { x: 0, y: 2 },
    radius: 4,
    opacity: 0.5,
  },
  hitSlop: 10,
};

export const DEFAULT_GAP_CONFIG: Required<GapConfig> = {
  enabled: true,
  size: 12,
  animated: true,
  animationDuration: 150,
};

export const DEFAULT_ANIMATION_CONFIG: Required<AnimationConfig> = {
  damping: 15,
  stiffness: 150,
  mass: 1,
  useSpring: true,
  duration: 200,
  waveEnabled: true,
  animateWhenPaused: false,
  flattenOnDrag: true,
  flattenDuration: 150,
};

export const DEFAULT_THEME_CONFIG: Required<ThemeConfig> = {
  activeColor: '#C9FE00',
  inactiveColor: '#3F4D10',
  thumbColor: '#C9FE00',
  activeGradient: { colors: [], locations: [], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  inactiveGradient: { colors: [], locations: [], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  thumbGradient: { colors: [], locations: [], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
};

export const DEFAULT_ACCESSIBILITY_CONFIG: Required<AccessibilityConfig> = {
  label: 'Slider',
  hint: 'Adjusts the value',
  valueFormat: (value, min, max) => `${Math.round((value / max) * 100)}%`,
  accessibilityIncrement: 0.1,
};

// ============================================
// LAYOUT DEFAULTS
// ============================================

export const DEFAULT_HEIGHT = 60;
export const DEFAULT_WIDTH = '100%';
export const DEFAULT_HIT_SLOP = 10;
export const DEFAULT_MIN = 0;
export const DEFAULT_STEP = 0;

// ============================================
// ANIMATION CONSTANTS
// ============================================

export const PHASE_CYCLE = Math.PI * 2 * 10;
export const MIN_PATH_WIDTH = 5;
export const THROTTLE_MS = 16; // ~60fps

// ============================================
// WAVE FUNCTION CONSTANTS
// ============================================

export const WAVE_FUNCTIONS = {
  [WaveType.SINE]: (x: number, frequency: number, phase: number) => 
    Math.sin(x * frequency + phase),
  [WaveType.COSINE]: (x: number, frequency: number, phase: number) => 
    Math.cos(x * frequency + phase),
  [WaveType.TRIANGLE]: (x: number, frequency: number, phase: number) => 
    (2 / Math.PI) * Math.asin(Math.sin(x * frequency + phase)),
  [WaveType.SQUARE]: (x: number, frequency: number, phase: number) => 
    Math.sign(Math.sin(x * frequency + phase)),
  [WaveType.SAWTOOTH]: (x: number, frequency: number, phase: number) => 
    2 * ((x * frequency + phase) / (2 * Math.PI) - Math.floor(0.5 + (x * frequency + phase) / (2 * Math.PI))),
};