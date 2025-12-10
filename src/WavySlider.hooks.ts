import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedReaction,
  Easing,
  SharedValue,
} from 'react-native-reanimated';

import {
  WaveConfig,
  AnimationConfig,
  GapConfig,
  ThumbConfig,
  PathData,
} from './WavySlider.types';

import {
  clamp,
  snapToStep,
  normalize,
  generatePaths,
} from './WavySlider.utils';

import { PHASE_CYCLE, THROTTLE_MS } from './WavySlider.constants';

// ============================================
// LAYOUT HOOK
// ============================================

export const useSliderLayout = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const dimensionsShared = useSharedValue({ width: 0, height: 0 });

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    // Fix: Use Math.trunc to convert float values to integers
    // This prevents "Loss of precision during arithmetic conversion" errors in Hermes
    const width = Math.trunc(event.nativeEvent.layout.width);
    const height = Math.trunc(event.nativeEvent.layout.height);
    setDimensions({ width, height });
    dimensionsShared.value = { width, height };
  }, [dimensionsShared]);

  return { dimensions, dimensionsShared, onLayout };
};

// ============================================
// WAVE ANIMATION HOOK
// ============================================

export const useWaveAnimation = (
  isPlaying: boolean,
  animateWhenPaused: boolean,
  speed: number,
  direction: 'left' | 'right'
) => {
  const phase = useSharedValue(0);
  const animationRef = useRef<number | null>(null);
  // Bug fix: Use ref to track phase value instead of state in dependency array
  const phaseRef = useRef(0);
  const [phaseState, setPhaseState] = useState(0);

  useEffect(() => {
    const shouldAnimate = isPlaying || animateWhenPaused;

    if (!shouldAnimate) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const animate = () => {
      const delta = direction === 'left' ? -speed : speed;
      // Bug fix: Use ref instead of state to avoid memory leak and stale closure
      phaseRef.current = (phaseRef.current + delta) % PHASE_CYCLE;
      const newPhase = phaseRef.current;
      setPhaseState(newPhase);
      phase.value = newPhase;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
    // Bug fix: Removed phaseState from dependencies to prevent effect re-triggering every frame
  }, [isPlaying, animateWhenPaused, speed, direction]);

  return { phase, phaseState };
};

// ============================================
// DRAG STATE HOOK
// ============================================

export const useDragState = (
  animationConfig: Required<AnimationConfig>,
  thumbConfig: Required<ThumbConfig>,
  gapConfig: Required<GapConfig>
) => {
  const isDragging = useSharedValue(false);
  const thumbScale = useSharedValue(1);
  const gapSize = useSharedValue(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const springConfig = useMemo(() => ({
    damping: animationConfig.damping,
    stiffness: animationConfig.stiffness,
    mass: animationConfig.mass,
  }), [animationConfig]);

  // Bug fix: Removed 'worklet' directive - these run on JS thread via runOnJS
  const startDrag = useCallback(() => {
    isDragging.value = true;

    thumbScale.value = animationConfig.useSpring
      ? withSpring(thumbConfig.scaleOnDrag, springConfig)
      : withTiming(thumbConfig.scaleOnDrag, { duration: animationConfig.duration });

    if (gapConfig.enabled && gapConfig.animated) {
      gapSize.value = animationConfig.useSpring
        ? withSpring(gapConfig.size, springConfig)
        : withTiming(gapConfig.size, { duration: gapConfig.animationDuration });
    } else if (gapConfig.enabled) {
      gapSize.value = gapConfig.size;
    }

    setIsDraggingState(true);
  }, [animationConfig, thumbConfig, gapConfig, springConfig, isDragging, thumbScale, gapSize]);

  // Bug fix: Removed 'worklet' directive - these run on JS thread via runOnJS
  const endDrag = useCallback(() => {
    isDragging.value = false;

    thumbScale.value = animationConfig.useSpring
      ? withSpring(1, springConfig)
      : withTiming(1, { duration: animationConfig.duration });

    if (gapConfig.enabled) {
      gapSize.value = animationConfig.useSpring
        ? withSpring(0, springConfig)
        : withTiming(0, { duration: gapConfig.animationDuration });
    }

    setIsDraggingState(false);
  }, [animationConfig, gapConfig, springConfig, isDragging, thumbScale, gapSize]);

  return {
    isDragging,
    isDraggingState,
    thumbScale,
    gapSize,
    startDrag,
    endDrag,
  };
};

// ============================================
// VALUE HANDLING HOOK
// ============================================

export const useValueHandler = (
  value: number,
  min: number,
  max: number,
  step: number,
  snapToStepEnabled: boolean,
  onChange: (value: number) => void,
  onSlidingStart?: (value: number) => void,
  onSlidingComplete?: (value: number) => void,
  hapticOnChange?: () => void
) => {
  const lastValueRef = useRef(value);
  const throttleRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup throttle timeout on unmount to prevent memory leak
  useEffect(() => {
    return () => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
    };
  }, []);

  const handleValueChange = useCallback((newValue: number) => {
    let finalValue = clamp(newValue, min, max);

    if (step > 0 && snapToStepEnabled) {
      finalValue = snapToStep(finalValue, step, min);
    }

    // Avoid unnecessary updates
    if (finalValue === lastValueRef.current) return;

    lastValueRef.current = finalValue;
    onChange(finalValue);

    // Throttled haptic feedback
    if (hapticOnChange) {
      if (!throttleRef.current) {
        hapticOnChange();
        throttleRef.current = setTimeout(() => {
          throttleRef.current = null;
        }, THROTTLE_MS);
      }
    }
  }, [min, max, step, snapToStepEnabled, onChange, hapticOnChange]);

  const handleSlidingStart = useCallback((val: number) => {
    onSlidingStart?.(val);
  }, [onSlidingStart]);

  const handleSlidingComplete = useCallback((val: number) => {
    onSlidingComplete?.(val);
    if (throttleRef.current) {
      clearTimeout(throttleRef.current);
      throttleRef.current = null;
    }
  }, [onSlidingComplete]);

  return {
    handleValueChange,
    handleSlidingStart,
    handleSlidingComplete,
  };
};

// ============================================
// PATH GENERATION HOOK
// ============================================

export const usePathGeneration = (
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
  return useMemo(() => {
    if (containerWidth === 0) {
      return { activePath: '', inactivePath: '' };
    }

    return generatePaths(
      containerWidth,
      progressX,
      centerY,
      waveConfig,
      phase,
      isDragging,
      gapConfig,
      flattenOnDrag,
      trackThickness
    );
  }, [containerWidth, progressX, centerY, waveConfig, phase, isDragging, gapConfig, flattenOnDrag, trackThickness]);
};

// ============================================
// ANIMATED STYLES HOOK
// ============================================

export const useAnimatedThumbStyle = (
  thumbScale: SharedValue<number>,
  thumbOpacity: number
) => {
  return useAnimatedStyle(() => ({
    transform: [{ scale: thumbScale.value }],
    opacity: thumbOpacity,
  }));
};