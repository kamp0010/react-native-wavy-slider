import { ViewStyle, StyleProp } from 'react-native';

// ============================================
// ENUMS
// ============================================

export enum WaveType {
  SINE = 'sine',
  COSINE = 'cosine',
  TRIANGLE = 'triangle',
  SQUARE = 'square',
  SAWTOOTH = 'sawtooth',
}

export enum WaveDirection {
  LEFT = 'left',
  RIGHT = 'right',
}

export enum ThumbShape {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  ROUNDED_RECT = 'rounded_rect',
  DIAMOND = 'diamond',
  LINE = 'line',
}

export enum SliderOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

// ============================================
// CONFIGURATION INTERFACES
// ============================================

export interface WaveConfig {
  /** Wave type/shape */
  type?: WaveType;
  
  /** Height of the wave peaks (0 = flat line) */
  amplitude?: number;
  
  /** Number of wave cycles - controls wave "length" (higher = more compressed waves) */
  frequency?: number;
  
  /** Alternative to frequency - wavelength in pixels */
  wavelength?: number;
  
  /** Animation speed (higher = faster) */
  speed?: number;
  
  /** Direction of wave animation */
  direction?: WaveDirection;
  
  /** Stroke thickness of the active wave */
  thickness?: number;
  
  /** Path resolution - lower = smoother but more expensive */
  resolution?: number;
  
  /** Number of complete wave cycles to display (alternative to frequency) */
  cycles?: number;
  
  /** Phase offset in radians */
  phaseOffset?: number;
}

export interface TrackConfig {
  /** Thickness of the inactive track */
  thickness?: number;
  
  /** Border radius for track ends */
  borderRadius?: number;
  
  /** Track height (for background track styling) */
  height?: number;
  
  /** Show background track */
  showBackground?: boolean;
  
  /** Background track color */
  backgroundColor?: string;
  
  /** Background track opacity */
  backgroundOpacity?: number;
}

export interface ThumbConfig {
  /** Show or hide thumb */
  visible?: boolean;
  
  /** Thumb shape */
  shape?: ThumbShape;
  
  /** Thumb width */
  width?: number;
  
  /** Thumb height */
  height?: number;
  
  /** Border radius (for rectangle shapes) */
  borderRadius?: number;
  
  /** Scale factor when dragging */
  scaleOnDrag?: number;
  
  /** Opacity when dragging */
  opacityOnDrag?: number;
  
  /** Border width */
  borderWidth?: number;
  
  /** Border color */
  borderColor?: string;
  
  /** Shadow configuration */
  shadow?: {
    enabled?: boolean;
    color?: string;
    offset?: { x: number; y: number };
    radius?: number;
    opacity?: number;
  };
  
  /** Hitslop for easier touch */
  hitSlop?: number;
}

export interface GapConfig {
  /** Enable gap/disconnect effect when dragging */
  enabled?: boolean;
  
  /** Gap size in pixels */
  size?: number;
  
  /** Animate gap appearance */
  animated?: boolean;
  
  /** Gap animation duration in ms */
  animationDuration?: number;
}

export interface AnimationConfig {
  /** Spring damping for animations */
  damping?: number;
  
  /** Spring stiffness */
  stiffness?: number;
  
  /** Spring mass */
  mass?: number;
  
  /** Use spring or timing animation */
  useSpring?: boolean;
  
  /** Timing animation duration */
  duration?: number;
  
  /** Wave animation enabled */
  waveEnabled?: boolean;
  
  /** Continue wave animation when paused */
  animateWhenPaused?: boolean;
  
  /** Flatten wave when dragging */
  flattenOnDrag?: boolean;
  
  /** Flatten animation duration */
  flattenDuration?: number;
}

export interface ThemeConfig {
  /** Active/progress track color */
  activeColor?: string;
  
  /** Inactive track color */
  inactiveColor?: string;
  
  /** Thumb color */
  thumbColor?: string;
  
  /** Active track gradient (overrides activeColor) */
  activeGradient?: {
    colors: string[];
    locations?: number[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
  
  /** Inactive track gradient */
  inactiveGradient?: {
    colors: string[];
    locations?: number[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
  
  /** Thumb gradient */
  thumbGradient?: {
    colors: string[];
    locations?: number[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
}

export interface HapticConfig {
  /** Enable haptic feedback */
  enabled?: boolean;
  
  /** Callback for drag start haptic */
  onStart?: () => void;
  
  /** Callback for value change haptic (throttled) */
  onChange?: () => void;
  
  /** Callback for drag end haptic */
  onEnd?: () => void;
  
  /** Callback for step snap haptic */
  onStep?: () => void;
  
  /** Throttle onChange haptic calls (ms) */
  throttleMs?: number;
}

export interface AccessibilityConfig {
  /** Accessibility label */
  label?: string;
  
  /** Accessibility hint */
  hint?: string;
  
  /** Value format for screen readers */
  valueFormat?: (value: number, min: number, max: number) => string;
  
  /** Increment for accessibility actions */
  accessibilityIncrement?: number;
}

export interface BoundsConfig {
  /** Minimum value */
  min?: number;
  
  /** Maximum value */
  max: number;
  
  /** Step increment (0 = continuous) */
  step?: number;
  
  /** Snap to steps */
  snapToStep?: boolean;
  
  /** Allowed range within min-max */
  range?: {
    lower?: number;
    upper?: number;
  };
}

// ============================================
// MAIN PROPS INTERFACE
// ============================================

export interface WavySliderProps {
  // ============ REQUIRED PROPS ============
  /** Current value */
  value: number;
  
  /** Maximum value (or use boundsConfig) */
  max: number;
  
  /** Value change handler */
  onChange: (value: number) => void;
  
  // ============ OPTIONAL VALUE PROPS ============
  /** Minimum value */
  min?: number;
  
  /** Step increment */
  step?: number;
  
  // ============ STATE PROPS ============
  /** Playing state - animates wave when true */
  isPlaying?: boolean;
  
  /** Disabled state */
  disabled?: boolean;
  
  /** Loading state */
  loading?: boolean;
  
  // ============ LAYOUT PROPS ============
  /** Component width */
  width?: number | `${number}%` | 'auto';
  
  /** Component height */
  height?: number;
  
  /** Orientation */
  orientation?: SliderOrientation;
  
  /** Container style */
  style?: StyleProp<ViewStyle>;
  
  /** Additional padding for touch area */
  hitSlop?: number | { top?: number; bottom?: number; left?: number; right?: number };
  
  // ============ CONFIGURATION OBJECTS ============
  /** Wave configuration */
  wave?: WaveConfig;
  
  /** Track configuration */
  track?: TrackConfig;
  
  /** Thumb configuration */
  thumb?: ThumbConfig;
  
  /** Gap/disconnect configuration */
  gap?: GapConfig;
  
  /** Animation configuration */
  animation?: AnimationConfig;
  
  /** Theme/colors configuration */
  theme?: ThemeConfig;
  
  /** Haptic feedback configuration */
  haptic?: HapticConfig;
  
  /** Accessibility configuration */
  accessibility?: AccessibilityConfig;
  
  /** Bounds configuration */
  bounds?: BoundsConfig;
  
  // ============ CALLBACKS ============
  /** Called when user starts interacting */
  onSlidingStart?: (value: number) => void;
  
  /** Called when user stops interacting */
  onSlidingComplete?: (value: number) => void;
  
  /** Called on each value change during sliding */
  onValueChange?: (value: number) => void;
  
  // ============ QUICK CUSTOMIZATION (LEGACY SUPPORT) ============
  /** @deprecated Use wave.amplitude */
  waveAmplitude?: number;
  
  /** @deprecated Use wave.frequency */
  waveFrequency?: number;
  
  /** @deprecated Use wave.speed */
  waveSpeed?: number;
  
  /** @deprecated Use wave.thickness */
  waveThickness?: number;
  
  /** @deprecated Use track.thickness */
  trackThickness?: number;
  
  /** @deprecated Use theme.activeColor */
  activeColor?: string;
  
  /** @deprecated Use theme.inactiveColor */
  inactiveColor?: string;
  
  /** @deprecated Use theme.thumbColor */
  thumbColor?: string;
  
  /** @deprecated Use thumb.width */
  thumbWidth?: number;
  
  /** @deprecated Use thumb.height */
  thumbHeight?: number;
  
  // ============ REF ============
  /** Ref for imperative methods */
  ref?: React.Ref<WavySliderRef>;
}

// ============================================
// IMPERATIVE HANDLE INTERFACE
// ============================================

export interface WavySliderRef {
  /** Set value programmatically with animation */
  setValue: (value: number, animated?: boolean) => void;
  
  /** Get current value */
  getValue: () => number;
  
  /** Start wave animation */
  startAnimation: () => void;
  
  /** Stop wave animation */
  stopAnimation: () => void;
  
  /** Reset to initial value */
  reset: () => void;
  
  /** Focus for accessibility */
  focus: () => void;
}

// ============================================
// INTERNAL TYPES
// ============================================

export interface InternalState {
  containerWidth: number;
  containerHeight: number;
  isDragging: boolean;
  phase: number;
}

export interface PathData {
  activePath: string;
  inactivePath: string;
}

export interface ComputedDimensions {
  thumbX: number;
  thumbY: number;
  centerY: number;
  progressWidth: number;
}