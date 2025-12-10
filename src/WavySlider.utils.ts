import {
  WaveType,
  WaveConfig,
  TrackConfig,
  ThumbConfig,
  GapConfig,
  AnimationConfig,
  ThemeConfig,
  PathData,
  ComputedDimensions,
} from './WavySlider.types';

import {
  DEFAULT_WAVE_CONFIG,
  DEFAULT_TRACK_CONFIG,
  DEFAULT_THUMB_CONFIG,
  DEFAULT_GAP_CONFIG,
  DEFAULT_ANIMATION_CONFIG,
  DEFAULT_THEME_CONFIG,
  WAVE_FUNCTIONS,
  MIN_PATH_WIDTH,
} from './WavySlider.constants';

// ============================================
// MATH UTILITIES
// ============================================

export const clamp = (value: number, min: number, max: number): number => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export const snapToStep = (value: number, step: number, min: number): number => {
  'worklet';
  if (step <= 0) return value;
  return Math.round((value - min) / step) * step + min;
};

export const lerp = (a: number, b: number, t: number): number => {
  'worklet';
  return a + (b - a) * t;
};

export const normalize = (value: number, min: number, max: number): number => {
  'worklet';
  if (max === min) return 0;
  return (value - min) / (max - min);
};

export const denormalize = (ratio: number, min: number, max: number): number => {
  'worklet';
  return min + ratio * (max - min);
};

// ============================================
// CONFIGURATION MERGING
// ============================================

export const mergeWaveConfig = (
  config?: WaveConfig,
  legacyAmplitude?: number,
  legacyFrequency?: number,
  legacySpeed?: number,
  legacyThickness?: number
): Required<WaveConfig> => {
  return {
    ...DEFAULT_WAVE_CONFIG,
    ...config,
    amplitude: legacyAmplitude ?? config?.amplitude ?? DEFAULT_WAVE_CONFIG.amplitude,
    frequency: legacyFrequency ?? config?.frequency ?? DEFAULT_WAVE_CONFIG.frequency,
    speed: legacySpeed ?? config?.speed ?? DEFAULT_WAVE_CONFIG.speed,
    thickness: legacyThickness ?? config?.thickness ?? DEFAULT_WAVE_CONFIG.thickness,
  };
};

export const mergeTrackConfig = (
  config?: TrackConfig,
  legacyThickness?: number
): Required<TrackConfig> => {
  return {
    ...DEFAULT_TRACK_CONFIG,
    ...config,
    thickness: legacyThickness ?? config?.thickness ?? DEFAULT_TRACK_CONFIG.thickness,
  };
};

export const mergeThumbConfig = (
  config?: ThumbConfig,
  legacyWidth?: number,
  legacyHeight?: number,
  legacyColor?: string
): Required<ThumbConfig> => {
  return {
    ...DEFAULT_THUMB_CONFIG,
    ...config,
    width: legacyWidth ?? config?.width ?? DEFAULT_THUMB_CONFIG.width,
    height: legacyHeight ?? config?.height ?? DEFAULT_THUMB_CONFIG.height,
    shadow: {
      ...DEFAULT_THUMB_CONFIG.shadow,
      ...config?.shadow,
    },
  };
};

export const mergeGapConfig = (config?: GapConfig): Required<GapConfig> => {
  return {
    ...DEFAULT_GAP_CONFIG,
    ...config,
  };
};

export const mergeAnimationConfig = (config?: AnimationConfig): Required<AnimationConfig> => {
  return {
    ...DEFAULT_ANIMATION_CONFIG,
    ...config,
  };
};

export const mergeThemeConfig = (
  config?: ThemeConfig,
  legacyActiveColor?: string,
  legacyInactiveColor?: string,
  legacyThumbColor?: string
): Required<ThemeConfig> => {
  return {
    ...DEFAULT_THEME_CONFIG,
    ...config,
    activeColor: legacyActiveColor ?? config?.activeColor ?? DEFAULT_THEME_CONFIG.activeColor,
    inactiveColor: legacyInactiveColor ?? config?.inactiveColor ?? DEFAULT_THEME_CONFIG.inactiveColor,
    thumbColor: legacyThumbColor ?? config?.thumbColor ?? DEFAULT_THEME_CONFIG.thumbColor,
    activeGradient: {
      ...DEFAULT_THEME_CONFIG.activeGradient,
      ...config?.activeGradient,
    },
    inactiveGradient: {
      ...DEFAULT_THEME_CONFIG.inactiveGradient,
      ...config?.inactiveGradient,
    },
    thumbGradient: {
      ...DEFAULT_THEME_CONFIG.thumbGradient,
      ...config?.thumbGradient,
    },
  };
};

// ============================================
// PATH GENERATION
// ============================================

export const generateWavePath = (
  startX: number,
  endX: number,
  centerY: number,
  config: Required<WaveConfig>,
  phase: number,
  flatten: boolean = false
): string => {
  'worklet';

  // Handle edge cases
  if (endX <= startX) {
    return `M ${startX.toFixed(2)} ${centerY.toFixed(2)}`;
  }

  if (flatten || endX - startX < MIN_PATH_WIDTH || config.amplitude === 0) {
    return `M ${startX.toFixed(2)} ${centerY.toFixed(2)} L ${endX.toFixed(2)} ${centerY.toFixed(2)}`;
  }

  // Calculate effective frequency
  let effectiveFrequency = config.frequency;

  if (config.wavelength > 0) {
    effectiveFrequency = (2 * Math.PI) / config.wavelength;
  } else if (config.cycles > 0) {
    const pathWidth = endX - startX;
    // Bug fix: Guard against division by zero or very small pathWidth
    if (pathWidth >= MIN_PATH_WIDTH) {
      effectiveFrequency = (config.cycles * 2 * Math.PI) / pathWidth;
    }
  }

  // Get wave function
  const waveFunction = WAVE_FUNCTIONS[config.type] || WAVE_FUNCTIONS.sine;

  // Generate path
  const startY = centerY + waveFunction(startX, effectiveFrequency, phase + config.phaseOffset) * config.amplitude;
  let path = `M ${startX.toFixed(2)} ${startY.toFixed(2)}`;

  for (let x = startX + config.resolution; x <= endX; x += config.resolution) {
    const y = centerY + waveFunction(x, effectiveFrequency, phase + config.phaseOffset) * config.amplitude;
    path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }

  // Ensure we end exactly at endX
  const finalY = centerY + waveFunction(endX, effectiveFrequency, phase + config.phaseOffset) * config.amplitude;
  path += ` L ${endX.toFixed(2)} ${finalY.toFixed(2)}`;

  return path;
};

export const generateStraightPath = (
  startX: number,
  endX: number,
  centerY: number,
  strokeWidth: number = 0
): string => {
  'worklet';
  if (endX <= startX) {
    return `M ${startX.toFixed(2)} ${centerY.toFixed(2)}`;
  }
  // Offset the end by half strokeWidth so the rounded cap is visible within container
  const adjustedEndX = strokeWidth > 0 ? endX - strokeWidth / 2 : endX;
  return `M ${startX.toFixed(2)} ${centerY.toFixed(2)} L ${adjustedEndX.toFixed(2)} ${centerY.toFixed(2)}`;
};

export const generatePaths = (
  containerWidth: number,
  progressX: number,
  centerY: number,
  waveConfig: Required<WaveConfig>,
  phase: number,
  isDragging: boolean,
  gapConfig: Required<GapConfig>,
  flattenOnDrag: boolean,
  trackThickness: number = 0
): PathData => {
  'worklet';

  const shouldFlatten = flattenOnDrag && isDragging;
  const gap = isDragging && gapConfig.enabled ? gapConfig.size : 0;

  // Calculate endpoints with gap
  const activeEndX = Math.max(0, progressX - gap);
  const inactiveStartX = Math.min(containerWidth, progressX + gap);

  // Generate active path (wave or straight)
  const activePath = shouldFlatten
    ? generateStraightPath(0, activeEndX, centerY)
    : generateWavePath(0, activeEndX, centerY, waveConfig, phase, false);

  // Generate inactive path (always straight) - pass trackThickness for rounded end cap visibility
  const inactivePath = generateStraightPath(inactiveStartX, containerWidth, centerY, trackThickness);

  return { activePath, inactivePath };
};

// ============================================
// DIMENSION CALCULATIONS
// ============================================

export const computeDimensions = (
  value: number,
  min: number,
  max: number,
  containerWidth: number,
  containerHeight: number,
  thumbConfig: Required<ThumbConfig>
): ComputedDimensions => {
  const ratio = normalize(value, min, max);
  const centerY = containerHeight / 2;
  const progressWidth = containerWidth * ratio;
  const thumbX = progressWidth - thumbConfig.width / 2;
  const thumbY = centerY - thumbConfig.height / 2;

  // Fix: Use Math.trunc to convert float values to integers
  // This prevents "Loss of precision during arithmetic conversion" errors in Hermes
  return {
    thumbX: Math.trunc(thumbX * 100) / 100,
    thumbY: Math.trunc(thumbY * 100) / 100,
    centerY: Math.trunc(centerY * 100) / 100,
    progressWidth: Math.trunc(progressWidth * 100) / 100,
  };
};

// ============================================
// THROTTLE UTILITY
// ============================================

export const createThrottle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T => {
  let inThrottle = false;

  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  }) as T;
};

// ============================================
// THUMB SHAPE PATH GENERATORS
// ============================================

export const getThumbPath = (
  shape: string,
  x: number,
  y: number,
  width: number,
  height: number,
  borderRadius: number
): string => {
  switch (shape) {
    case 'circle':
      const radius = Math.min(width, height) / 2;
      const cx = x + width / 2;
      const cy = y + height / 2;
      return `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy + radius} A ${radius} ${radius} 0 1 1 ${cx} ${cy - radius}`;

    case 'diamond':
      const mx = x + width / 2;
      const my = y + height / 2;
      return `M ${mx} ${y} L ${x + width} ${my} L ${mx} ${y + height} L ${x} ${my} Z`;

    case 'line':
      return `M ${x + width / 2} ${y} L ${x + width / 2} ${y + height}`;

    default:
      return ''; // Use Rect component for rectangles
  }
};