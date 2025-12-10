# WavySlider

A beautiful, highly customizable animated wavy slider component for React Native. Features smooth sine wave animations, gesture-based interactions, gradient support, and full accessibility.

![React Native](https://img.shields.io/badge/React%20Native-0.70+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- 🌊 **Animated Wave Track** - Smooth wave animation with multiple wave types (sine, cosine, triangle, square, sawtooth)
- 🎨 **Highly Customizable** - Full control over wave amplitude, frequency, speed, thickness, colors, and more
- 📱 **Gesture Support** - Pan and tap gestures powered by react-native-gesture-handler
- ⚡ **Performant** - Built with react-native-reanimated for butter-smooth 60fps animations
- ♿ **Accessible** - Full accessibility support with customizable screen reader labels
- 🎯 **Haptic Feedback** - Configurable haptic feedback callbacks for start, change, end, and step events
- 🌈 **Gradient Support** - Apply gradients to active track, inactive track, and thumb
- 🎛️ **Gap Effect** - Animated disconnect effect around thumb when dragging
- 🔧 **Imperative API** - Ref-based control for programmatic value changes

---

## 📦 Dependencies

```bash
npm install react-native-reanimated react-native-gesture-handler react-native-svg
```

**Required peer dependencies:**
- `react-native-reanimated` >= 3.0.0
- `react-native-gesture-handler` >= 2.0.0
- `react-native-svg` >= 13.0.0

> **Note:** Make sure to follow the installation instructions for each library, especially for `react-native-reanimated` which requires babel plugin configuration.

---

## 🚀 Quick Start

```jsx
import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WavySlider } from './components';

const App = () => {
  const [value, setValue] = useState(30);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WavySlider
        value={value}
        max={100}
        onChange={setValue}
        isPlaying={true}
      />
    </GestureHandlerRootView>
  );
};
```

> **Important:** Always wrap your app with `GestureHandlerRootView` for gestures to work.

---

## 📖 API Reference

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `value` | `number` | Current slider value |
| `max` | `number` | Maximum value |
| `onChange` | `(value: number) => void` | Callback when value changes |

### Optional Value Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min` | `number` | `0` | Minimum value |
| `step` | `number` | `0` | Step increment (0 = continuous) |

### State Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isPlaying` | `boolean` | `false` | Animate wave when true |
| `disabled` | `boolean` | `false` | Disable all interactions |
| `loading` | `boolean` | `false` | Show loading state (reduced opacity) |

### Layout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number \| string` | `'100%'` | Component width (number, percentage, or 'auto') |
| `height` | `number` | `60` | Component height in pixels |
| `orientation` | `SliderOrientation` | `'horizontal'` | Slider orientation |
| `style` | `StyleProp<ViewStyle>` | - | Additional container styles |
| `hitSlop` | `number \| object` | `10` | Touch area padding |

### Callback Props

| Prop | Type | Description |
|------|------|-------------|
| `onSlidingStart` | `(value: number) => void` | Called when user starts interacting |
| `onSlidingComplete` | `(value: number) => void` | Called when user stops interacting |
| `onValueChange` | `(value: number) => void` | Called on each value change during sliding |

---

## ⚙️ Configuration Objects

### Wave Configuration (`wave`)

Controls the animated wave appearance on the active track.

```jsx
<WavySlider
  wave={{
    type: WaveType.SINE,      // Wave shape
    amplitude: 8,              // Wave height (0 = flat line)
    frequency: 0.1,            // Wave density (higher = more waves)
    wavelength: 0,             // Alternative to frequency (pixels per cycle)
    speed: 0.08,               // Animation speed
    direction: 'left',         // Animation direction: 'left' | 'right'
    thickness: 4,              // Stroke width
    resolution: 2,             // Path resolution (lower = smoother)
    cycles: 0,                 // Fixed number of wave cycles
    phaseOffset: 0,            // Phase offset in radians
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `WaveType` | `'sine'` | Wave shape: `'sine'`, `'cosine'`, `'triangle'`, `'square'`, `'sawtooth'` |
| `amplitude` | `number` | `8` | Height of wave peaks (0 = flat line) |
| `frequency` | `number` | `0.1` | Wave density (higher = more compressed waves) |
| `wavelength` | `number` | `0` | Alternative to frequency - wavelength in pixels (0 = use frequency) |
| `speed` | `number` | `0.08` | Animation speed (higher = faster) |
| `direction` | `'left' \| 'right'` | `'left'` | Direction of wave animation |
| `thickness` | `number` | `4` | Stroke thickness of active wave |
| `resolution` | `number` | `2` | Path resolution - lower is smoother but more expensive |
| `cycles` | `number` | `0` | Fixed number of complete wave cycles (0 = use frequency) |
| `phaseOffset` | `number` | `0` | Phase offset in radians |

---

### Track Configuration (`track`)

Controls the inactive track appearance.

```jsx
<WavySlider
  track={{
    thickness: 4,
    borderRadius: 2,
    height: 4,
    showBackground: false,
    backgroundColor: 'rgba(255,255,255,0.1)',
    backgroundOpacity: 1,
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `thickness` | `number` | `4` | Stroke thickness of inactive track |
| `borderRadius` | `number` | `2` | Border radius for track ends |
| `height` | `number` | `4` | Track height (for background styling) |
| `showBackground` | `boolean` | `false` | Show full-width background track |
| `backgroundColor` | `string` | `'rgba(255,255,255,0.1)'` | Background track color |
| `backgroundOpacity` | `number` | `1` | Background track opacity |

---

### Thumb Configuration (`thumb`)

Controls the draggable thumb/handle.

```jsx
<WavySlider
  thumb={{
    visible: true,
    shape: ThumbShape.ROUNDED_RECT,
    width: 5,
    height: 24,
    borderRadius: 2,
    scaleOnDrag: 1.2,
    opacityOnDrag: 1,
    borderWidth: 0,
    borderColor: 'transparent',
    hitSlop: 10,
    shadow: {
      enabled: false,
      color: 'rgba(0,0,0,0.3)',
      offset: { x: 0, y: 2 },
      radius: 4,
      opacity: 0.5,
    },
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `visible` | `boolean` | `true` | Show/hide thumb |
| `shape` | `ThumbShape` | `'rounded_rect'` | Shape: `'rectangle'`, `'circle'`, `'rounded_rect'`, `'diamond'`, `'line'` |
| `width` | `number` | `5` | Thumb width |
| `height` | `number` | `24` | Thumb height |
| `borderRadius` | `number` | `2` | Border radius (for rectangle shapes) |
| `scaleOnDrag` | `number` | `1.2` | Scale factor when dragging |
| `opacityOnDrag` | `number` | `1` | Opacity when dragging |
| `borderWidth` | `number` | `0` | Border width |
| `borderColor` | `string` | `'transparent'` | Border color |
| `hitSlop` | `number` | `10` | Touch area padding |
| `shadow` | `object` | `{ enabled: false, ... }` | Shadow configuration |

**Shadow sub-properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `shadow.enabled` | `boolean` | `false` | Enable shadow |
| `shadow.color` | `string` | `'rgba(0,0,0,0.3)'` | Shadow color |
| `shadow.offset` | `{ x, y }` | `{ x: 0, y: 2 }` | Shadow offset |
| `shadow.radius` | `number` | `4` | Shadow blur radius |
| `shadow.opacity` | `number` | `0.5` | Shadow opacity |

---

### Gap Configuration (`gap`)

Controls the disconnect effect around the thumb when dragging.

```jsx
<WavySlider
  gap={{
    enabled: true,
    size: 12,
    animated: true,
    animationDuration: 150,
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `true` | Enable gap effect when dragging |
| `size` | `number` | `12` | Gap size in pixels |
| `animated` | `boolean` | `true` | Animate gap appearance |
| `animationDuration` | `number` | `150` | Animation duration in ms |

---

### Animation Configuration (`animation`)

Controls all animation behaviors.

```jsx
<WavySlider
  animation={{
    damping: 15,
    stiffness: 150,
    mass: 1,
    useSpring: true,
    duration: 200,
    waveEnabled: true,
    animateWhenPaused: false,
    flattenOnDrag: true,
    flattenDuration: 150,
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `damping` | `number` | `15` | Spring damping |
| `stiffness` | `number` | `150` | Spring stiffness |
| `mass` | `number` | `1` | Spring mass |
| `useSpring` | `boolean` | `true` | Use spring vs timing animation |
| `duration` | `number` | `200` | Timing animation duration (ms) |
| `waveEnabled` | `boolean` | `true` | Enable wave animation |
| `animateWhenPaused` | `boolean` | `false` | Continue wave animation when paused |
| `flattenOnDrag` | `boolean` | `true` | Flatten wave to straight line when dragging |
| `flattenDuration` | `number` | `150` | Flatten animation duration (ms) |

---

### Theme Configuration (`theme`)

Controls all colors and gradients.

```jsx
<WavySlider
  theme={{
    activeColor: '#C9FE00',
    inactiveColor: '#3F4D10',
    thumbColor: '#C9FE00',
    activeGradient: {
      colors: ['#667eea', '#764ba2'],
      locations: [0, 1],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    inactiveGradient: {
      colors: [],
      locations: [],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
    thumbGradient: {
      colors: [],
      locations: [],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 0 },
    },
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `activeColor` | `string` | `'#C9FE00'` | Active/progress track color |
| `inactiveColor` | `string` | `'#3F4D10'` | Inactive track color |
| `thumbColor` | `string` | `'#C9FE00'` | Thumb color |
| `activeGradient` | `GradientConfig` | `{ colors: [] }` | Gradient for active track (overrides activeColor) |
| `inactiveGradient` | `GradientConfig` | `{ colors: [] }` | Gradient for inactive track |
| `thumbGradient` | `GradientConfig` | `{ colors: [] }` | Gradient for thumb |

**Gradient sub-properties:**

| Property | Type | Description |
|----------|------|-------------|
| `colors` | `string[]` | Array of colors (min 2 for gradient to apply) |
| `locations` | `number[]` | Color stop positions (0-1) |
| `start` | `{ x, y }` | Gradient start point (0-1) |
| `end` | `{ x, y }` | Gradient end point (0-1) |

---

### Haptic Configuration (`haptic`)

Configure haptic feedback callbacks.

```jsx
import * as Haptics from 'expo-haptics';

<WavySlider
  haptic={{
    enabled: true,
    onStart: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    onChange: () => Haptics.selectionAsync(),
    onEnd: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    onStep: () => Haptics.selectionAsync(),
    throttleMs: 50,
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Enable haptic feedback |
| `onStart` | `() => void` | - | Called on drag start |
| `onChange` | `() => void` | - | Called on value change (throttled) |
| `onEnd` | `() => void` | - | Called on drag end |
| `onStep` | `() => void` | - | Called when snapping to step |
| `throttleMs` | `number` | `16` | Throttle onChange calls (ms) |

---

### Accessibility Configuration (`accessibility`)

Configure screen reader support.

```jsx
<WavySlider
  accessibility={{
    label: 'Volume Slider',
    hint: 'Swipe left or right to adjust volume',
    valueFormat: (value, min, max) => `${Math.round(value)} percent`,
    accessibilityIncrement: 5,
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | `string` | `'Slider'` | Accessibility label |
| `hint` | `string` | `'Adjusts the value'` | Accessibility hint |
| `valueFormat` | `(value, min, max) => string` | Percentage format | Value announcement format |
| `accessibilityIncrement` | `number` | `0.1` | Increment for accessibility actions |

---

### Bounds Configuration (`bounds`)

Advanced value constraints.

```jsx
<WavySlider
  bounds={{
    min: 0,
    max: 100,
    step: 5,
    snapToStep: true,
    range: {
      lower: 10,
      upper: 90,
    },
  }}
/>
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `min` | `number` | - | Override minimum value |
| `max` | `number` | **Required** | Maximum value |
| `step` | `number` | - | Override step increment |
| `snapToStep` | `boolean` | `true` | Snap to step values |
| `range.lower` | `number` | - | Lower bound constraint |
| `range.upper` | `number` | - | Upper bound constraint |

---

## 🎮 Imperative API (Ref)

```jsx
import { useRef } from 'react';

const sliderRef = useRef(null);

// Set value programmatically
sliderRef.current.setValue(50, true);

// Get current value
const currentValue = sliderRef.current.getValue();

// Reset to minimum
sliderRef.current.reset();

<WavySlider ref={sliderRef} ... />
```

| Method | Type | Description |
|--------|------|-------------|
| `setValue(value, animated?)` | `(number, boolean) => void` | Set value programmatically |
| `getValue()` | `() => number` | Get current value |
| `reset()` | `() => void` | Reset to minimum value |
| `startAnimation()` | `() => void` | Start wave animation |
| `stopAnimation()` | `() => void` | Stop wave animation |
| `focus()` | `() => void` | Focus for accessibility |

---

## 🔧 Enums

### WaveType

```typescript
enum WaveType {
  SINE = 'sine',
  COSINE = 'cosine',
  TRIANGLE = 'triangle',
  SQUARE = 'square',
  SAWTOOTH = 'sawtooth',
}
```

### ThumbShape

```typescript
enum ThumbShape {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  ROUNDED_RECT = 'rounded_rect',
  DIAMOND = 'diamond',
  LINE = 'line',
}
```

### SliderOrientation

```typescript
enum SliderOrientation {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}
```

### WaveDirection

```typescript
enum WaveDirection {
  LEFT = 'left',
  RIGHT = 'right',
}
```

---

## 🎨 Legacy Props (Deprecated)

For backward compatibility, these shorthand props are still supported but deprecated:

| Legacy Prop | Use Instead |
|-------------|-------------|
| `waveAmplitude` | `wave.amplitude` |
| `waveFrequency` | `wave.frequency` |
| `waveSpeed` | `wave.speed` |
| `waveThickness` | `wave.thickness` |
| `trackThickness` | `track.thickness` |
| `activeColor` | `theme.activeColor` |
| `inactiveColor` | `theme.inactiveColor` |
| `thumbColor` | `theme.thumbColor` |
| `thumbWidth` | `thumb.width` |
| `thumbHeight` | `thumb.height` |

---

## 📁 File Structure

```
components/
├── WavySlider.tsx          # Main component
├── WavySlider.hooks.ts     # Custom React hooks
├── WavySlider.utils.ts     # Utility functions & path generation
├── WavySlider.types.ts     # TypeScript interfaces & enums
├── WavySlider.constants.ts # Default configuration values
├── WavySlider.styles.ts    # StyleSheet definitions
├── WavySlider.presets.ts   # Pre-built configuration presets
└── index.ts                # Module exports
```

---

## 🎮 Complete Example

```jsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WavySlider, WaveType } from './components';

const App = () => {
  const [value, setValue] = useState(30);
  const [isPlaying, setIsPlaying] = useState(true);
  const sliderRef = useRef(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.value}>{Math.round(value)}%</Text>
      
      <WavySlider
        ref={sliderRef}
        value={value}
        max={100}
        min={0}
        step={1}
        onChange={setValue}
        isPlaying={isPlaying}
        width="100%"
        height={60}
        wave={{
          type: WaveType.SINE,
          amplitude: 10,
          frequency: 0.1,
          speed: 0.1,
          thickness: 5,
        }}
        track={{
          thickness: 4,
          showBackground: true,
          backgroundColor: 'rgba(255,255,255,0.05)',
        }}
        thumb={{
          visible: true,
          width: 6,
          height: 28,
          borderRadius: 3,
          scaleOnDrag: 1.3,
          shadow: {
            enabled: true,
            color: '#667eea',
            opacity: 0.4,
            radius: 8,
          },
        }}
        gap={{
          enabled: true,
          size: 15,
          animated: true,
        }}
        animation={{
          flattenOnDrag: true,
          useSpring: true,
          damping: 20,
        }}
        theme={{
          activeGradient: {
            colors: ['#667eea', '#764ba2'],
            start: { x: 0, y: 0 },
            end: { x: 1, y: 0 },
          },
          inactiveColor: '#2d2d2d',
          thumbColor: '#667eea',
        }}
        accessibility={{
          label: 'Progress',
          hint: 'Adjust the progress value',
        }}
        onSlidingStart={() => setIsPlaying(false)}
        onSlidingComplete={() => setIsPlaying(true)}
      />

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsPlaying(!isPlaying)}
        >
          <Text style={styles.buttonText}>
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => sliderRef.current?.reset()}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#121212',
  },
  value: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 40,
  },
  button: {
    backgroundColor: '#333',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
```

---

## 📄 License

MIT License - feel free to use in personal and commercial projects.
