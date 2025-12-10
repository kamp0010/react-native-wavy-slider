import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { View, AccessibilityInfo, Platform } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Svg, {
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';

import {
  WavySliderProps,
  WavySliderRef,
  WaveConfig,
  TrackConfig,
  ThumbConfig,
  GapConfig,
  AnimationConfig,
  ThemeConfig,
  SliderOrientation,
  ThumbShape,
} from './WavySlider.types';

import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  DEFAULT_HIT_SLOP,
  DEFAULT_MIN,
  DEFAULT_STEP,
  DEFAULT_ACCESSIBILITY_CONFIG,
} from './WavySlider.constants';

import {
  mergeWaveConfig,
  mergeTrackConfig,
  mergeThumbConfig,
  mergeGapConfig,
  mergeAnimationConfig,
  mergeThemeConfig,
  normalize,
  computeDimensions,
  generatePaths,
} from './WavySlider.utils';

import {
  useSliderLayout,
  useWaveAnimation,
  useDragState,
  useValueHandler,
  usePathGeneration,
  useAnimatedThumbStyle,
} from './WavySlider.hooks';

import { styles } from './WavySlider.styles';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const WavySlider = forwardRef<WavySliderRef, WavySliderProps>((props, ref) => {
  const {
    // Required
    value,
    max,
    onChange,

    // Optional value props
    min = DEFAULT_MIN,
    step = DEFAULT_STEP,

    // State
    isPlaying = false,
    disabled = false,
    loading = false,

    // Layout
    width = DEFAULT_WIDTH,
    height = DEFAULT_HEIGHT,
    orientation = SliderOrientation.HORIZONTAL,
    style,
    hitSlop = DEFAULT_HIT_SLOP,

    // Configs
    wave: waveProp,
    track: trackProp,
    thumb: thumbProp,
    gap: gapProp,
    animation: animationProp,
    theme: themeProp,
    haptic: hapticProp,
    accessibility: accessibilityProp,
    bounds: boundsProp,

    // Callbacks
    onSlidingStart,
    onSlidingComplete,
    onValueChange,

    // Legacy props
    waveAmplitude,
    waveFrequency,
    waveSpeed,
    waveThickness,
    trackThickness,
    activeColor,
    inactiveColor,
    thumbColor,
    thumbWidth,
    thumbHeight,
  } = props;

  // ============================================
  // MERGE CONFIGURATIONS
  // ============================================

  const waveConfig = useMemo(() =>
    mergeWaveConfig(waveProp, waveAmplitude, waveFrequency, waveSpeed, waveThickness),
    [waveProp, waveAmplitude, waveFrequency, waveSpeed, waveThickness]
  );

  const trackConfig = useMemo(() =>
    mergeTrackConfig(trackProp, trackThickness),
    [trackProp, trackThickness]
  );

  const thumbConfig = useMemo(() =>
    mergeThumbConfig(thumbProp, thumbWidth, thumbHeight, thumbColor),
    [thumbProp, thumbWidth, thumbHeight, thumbColor]
  );

  const gapConfig = useMemo(() => mergeGapConfig(gapProp), [gapProp]);

  const animationConfig = useMemo(() => mergeAnimationConfig(animationProp), [animationProp]);

  const themeConfig = useMemo(() =>
    mergeThemeConfig(themeProp, activeColor, inactiveColor, thumbColor),
    [themeProp, activeColor, inactiveColor, thumbColor]
  );

  const accessibilityConfig = useMemo(() => ({
    ...DEFAULT_ACCESSIBILITY_CONFIG,
    ...accessibilityProp,
  }), [accessibilityProp]);

  // ============================================
  // HOOKS
  // ============================================

  const { dimensions, dimensionsShared, onLayout } = useSliderLayout();

  const { phase, phaseState } = useWaveAnimation(
    isPlaying,
    animationConfig.animateWhenPaused,
    waveConfig.speed,
    waveConfig.direction
  );

  const {
    isDragging,
    isDraggingState,
    thumbScale,
    gapSize,
    startDrag,
    endDrag,
  } = useDragState(animationConfig, thumbConfig, gapConfig);

  const {
    handleValueChange,
    handleSlidingStart,
    handleSlidingComplete,
  } = useValueHandler(
    value,
    boundsProp?.min ?? min,
    boundsProp?.max ?? max,
    boundsProp?.step ?? step,
    boundsProp?.snapToStep ?? true,
    onChange,
    onSlidingStart,
    onSlidingComplete,
    hapticProp?.onChange
  );

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const effectiveMin = boundsProp?.min ?? min;
  const effectiveMax = boundsProp?.max ?? max;

  const { thumbX, thumbY, centerY, progressWidth } = useMemo(() =>
    computeDimensions(value, effectiveMin, effectiveMax, dimensions.width, height, thumbConfig),
    [value, effectiveMin, effectiveMax, dimensions.width, height, thumbConfig]
  );

  const pathData = usePathGeneration(
    dimensions.width,
    progressWidth,
    centerY,
    waveConfig,
    phaseState,
    isDraggingState,
    gapConfig,
    animationConfig.flattenOnDrag,
    trackConfig.thickness
  );

  // ============================================
  // GESTURE VALUE HANDLERS (JS Thread)
  // ============================================
  // Fix: These wrapper functions receive primitive values and compute
  // the slider value on the JS thread to avoid Hermes precision issues
  // when passing floats through runOnJS.

  const handleGestureValueChange = useCallback((offsetX: number, width: number) => {
    if (width === 0) return;
    const ratio = offsetX / width;
    const newValue = effectiveMin + ratio * (effectiveMax - effectiveMin);
    handleValueChange(newValue);
  }, [effectiveMin, effectiveMax, handleValueChange]);

  const handleGestureStart = useCallback((offsetX: number, width: number) => {
    if (width === 0) return;
    const ratio = offsetX / width;
    const newValue = effectiveMin + ratio * (effectiveMax - effectiveMin);
    handleValueChange(newValue);
    handleSlidingStart(newValue);
  }, [effectiveMin, effectiveMax, handleValueChange, handleSlidingStart]);

  const handleGestureUpdate = useCallback((offsetX: number, width: number) => {
    if (width === 0) return;
    const ratio = offsetX / width;
    const newValue = effectiveMin + ratio * (effectiveMax - effectiveMin);
    handleValueChange(newValue);
    if (onValueChange) {
      onValueChange(newValue);
    }
  }, [effectiveMin, effectiveMax, handleValueChange, onValueChange]);

  const handleGestureEnd = useCallback(() => {
    handleSlidingComplete(value);
  }, [handleSlidingComplete, value]);

  const handleTapEnd = useCallback((offsetX: number, width: number) => {
    if (width === 0) return;
    const ratio = offsetX / width;
    const newValue = effectiveMin + ratio * (effectiveMax - effectiveMin);
    handleValueChange(newValue);
    handleSlidingStart(newValue);
    handleSlidingComplete(newValue);
  }, [effectiveMin, effectiveMax, handleValueChange, handleSlidingStart, handleSlidingComplete]);

  // ============================================
  // GESTURES
  // ============================================

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(!disabled && !loading)
      .hitSlop(hitSlop)
      .onStart((event) => {
        'worklet';
        // Guard against zero width before layout completes
        if (dimensionsShared.value.width === 0) return;
        runOnJS(startDrag)();

        // Fix: Use Math.trunc to convert floats to integers (prevents Hermes precision error)
        const offsetX = Math.trunc(Math.min(Math.max(event.x, 0), dimensionsShared.value.width));
        const width = Math.trunc(dimensionsShared.value.width);
        runOnJS(handleGestureStart)(offsetX, width);

        if (hapticProp?.onStart) {
          runOnJS(hapticProp.onStart)();
        }
      })
      .onUpdate((event) => {
        'worklet';
        if (dimensionsShared.value.width === 0) return;

        // Fix: Use Math.trunc to convert floats to integers (prevents Hermes precision error)
        const offsetX = Math.trunc(Math.min(Math.max(event.x, 0), dimensionsShared.value.width));
        const width = Math.trunc(dimensionsShared.value.width);
        runOnJS(handleGestureUpdate)(offsetX, width);
      })
      .onEnd(() => {
        'worklet';
        runOnJS(endDrag)();
        runOnJS(handleGestureEnd)();

        if (hapticProp?.onEnd) {
          runOnJS(hapticProp.onEnd)();
        }
      });
  }, [
    disabled,
    loading,
    hitSlop,
    startDrag,
    endDrag,
    handleGestureStart,
    handleGestureUpdate,
    handleGestureEnd,
    hapticProp,
    dimensionsShared,
  ]);

  const tapGesture = useMemo(() => {
    return Gesture.Tap()
      .enabled(!disabled && !loading)
      .hitSlop(hitSlop)
      .onEnd((event) => {
        'worklet';
        if (dimensionsShared.value.width === 0) return;

        // Fix: Use Math.trunc to convert floats to integers (prevents Hermes precision error)
        const offsetX = Math.trunc(Math.min(Math.max(event.x, 0), dimensionsShared.value.width));
        const width = Math.trunc(dimensionsShared.value.width);
        runOnJS(handleTapEnd)(offsetX, width);

        if (hapticProp?.onStart) {
          runOnJS(hapticProp.onStart)();
        }
      });
  }, [
    disabled,
    loading,
    hitSlop,
    handleTapEnd,
    hapticProp,
    dimensionsShared,
  ]);

  const composedGesture = Gesture.Race(panGesture, tapGesture);

  // ============================================
  // ANIMATED STYLES
  // ============================================

  const thumbAnimatedStyle = useAnimatedThumbStyle(thumbScale, thumbConfig.opacityOnDrag);

  // ============================================
  // IMPERATIVE HANDLE
  // ============================================

  useImperativeHandle(ref, () => ({
    setValue: (newValue: number, animated = true) => {
      handleValueChange(newValue);
    },
    getValue: () => value,
    startAnimation: () => {
      // This would require exposing isPlaying state setter
    },
    stopAnimation: () => {
      // This would require exposing isPlaying state setter
    },
    reset: () => {
      handleValueChange(effectiveMin);
    },
    focus: () => {
      // Accessibility focus
    },
  }), [value, effectiveMin, handleValueChange]);

  // ============================================
  // GRADIENT CHECKS
  // ============================================

  const hasActiveGradient = themeConfig.activeGradient.colors.length >= 2;
  const hasInactiveGradient = themeConfig.inactiveGradient.colors.length >= 2;
  const hasThumbGradient = themeConfig.thumbGradient.colors.length >= 2;

  // ============================================
  // CONTAINER STYLES
  // ============================================

  const containerStyles = useMemo(() => [
    styles.container,
    {
      width: typeof width === 'number' ? width : undefined,
      height,
      flex: typeof width === 'string' && width !== 'auto' ? 1 : undefined,
    },
    disabled && styles.disabled,
    loading && styles.loading,
    style,
  ], [width, height, disabled, loading, style]);

  // ============================================
  // ACCESSIBILITY
  // ============================================

  const accessibilityValue = useMemo(() => ({
    // Fix: Use Math.round to convert float values to integers
    // accessibilityValue.now receiving floats causes "Loss of precision" error in new RN architecture
    min: Math.round(effectiveMin),
    max: Math.round(effectiveMax),
    now: Math.round(value),
    text: accessibilityConfig.valueFormat(value, effectiveMin, effectiveMax),
  }), [value, effectiveMin, effectiveMax, accessibilityConfig]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <GestureDetector gesture={composedGesture}>
      <Animated.View
        style={containerStyles}
        onLayout={onLayout}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityConfig.label}
        accessibilityHint={accessibilityConfig.hint}
        accessibilityValue={accessibilityValue}
        accessibilityState={{ disabled }}
      >
        <Svg
          width="100%"
          height={height}
          style={styles.svg}
        >
          <Defs>
            {hasActiveGradient && (
              <LinearGradient
                id="activeGradient"
                x1={themeConfig.activeGradient.start?.x ?? 0}
                y1={themeConfig.activeGradient.start?.y ?? 0}
                x2={themeConfig.activeGradient.end?.x ?? 1}
                y2={themeConfig.activeGradient.end?.y ?? 0}
              >
                {themeConfig.activeGradient.colors.map((color, index) => (
                  <Stop
                    key={index}
                    offset={
                      themeConfig.activeGradient.locations?.[index] ??
                      index / (themeConfig.activeGradient.colors.length - 1)
                    }
                    stopColor={color}
                  />
                ))}
              </LinearGradient>
            )}

            {hasInactiveGradient && (
              <LinearGradient
                id="inactiveGradient"
                x1={themeConfig.inactiveGradient.start?.x ?? 0}
                y1={themeConfig.inactiveGradient.start?.y ?? 0}
                x2={themeConfig.inactiveGradient.end?.x ?? 1}
                y2={themeConfig.inactiveGradient.end?.y ?? 0}
              >
                {themeConfig.inactiveGradient.colors.map((color, index) => (
                  <Stop
                    key={index}
                    offset={
                      themeConfig.inactiveGradient.locations?.[index] ??
                      index / (themeConfig.inactiveGradient.colors.length - 1)
                    }
                    stopColor={color}
                  />
                ))}
              </LinearGradient>
            )}

            {hasThumbGradient && (
              <LinearGradient
                id="thumbGradient"
                x1={themeConfig.thumbGradient.start?.x ?? 0}
                y1={themeConfig.thumbGradient.start?.y ?? 0}
                x2={themeConfig.thumbGradient.end?.x ?? 0}
                y2={themeConfig.thumbGradient.end?.y ?? 1}
              >
                {themeConfig.thumbGradient.colors.map((color, index) => (
                  <Stop
                    key={index}
                    offset={
                      themeConfig.thumbGradient.locations?.[index] ??
                      index / (themeConfig.thumbGradient.colors.length - 1)
                    }
                    stopColor={color}
                  />
                ))}
              </LinearGradient>
            )}
          </Defs>

          {/* Background Track (optional) */}
          {trackConfig.showBackground && (
            <Path
              d={`M 0 ${centerY.toFixed(2)} L ${dimensions.width.toFixed(2)} ${centerY.toFixed(2)}`}
              fill="none"
              stroke={trackConfig.backgroundColor}
              strokeWidth={trackConfig.height}
              strokeLinecap="round"
              opacity={trackConfig.backgroundOpacity}
            />
          )}

          {/* Inactive Track */}
          <Path
            d={pathData.inactivePath}
            fill="none"
            stroke={hasInactiveGradient ? 'url(#inactiveGradient)' : themeConfig.inactiveColor}
            strokeWidth={trackConfig.thickness}
            strokeLinecap="round"
          />

          {/* Active Track (Wave) */}
          <Path
            d={pathData.activePath}
            fill="none"
            stroke={hasActiveGradient ? 'url(#activeGradient)' : themeConfig.activeColor}
            strokeWidth={waveConfig.thickness}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

        </Svg>

        {/* Animated Thumb Overlay */}
        {thumbConfig.visible && (
          <Animated.View
            style={[
              styles.thumbContainer,
              {
                left: thumbX,
                top: thumbY,
                width: thumbConfig.width,
                height: thumbConfig.height,
                backgroundColor: hasThumbGradient ? 'transparent' : themeConfig.thumbColor,
                borderRadius: thumbConfig.borderRadius,
                borderWidth: thumbConfig.borderWidth,
                borderColor: thumbConfig.borderColor,
              },
              thumbConfig.shadow.enabled && {
                shadowColor: thumbConfig.shadow.color,
                shadowOffset: {
                  width: thumbConfig.shadow.offset?.x ?? 0,
                  height: thumbConfig.shadow.offset?.y ?? 2,
                },
                shadowOpacity: thumbConfig.shadow.opacity ?? 0.5,
                shadowRadius: thumbConfig.shadow.radius ?? 4,
                elevation: 5,
              },
              thumbAnimatedStyle,
            ]}
            pointerEvents="none"
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
});

WavySlider.displayName = 'WavySlider';

export default WavySlider;