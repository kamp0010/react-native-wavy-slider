import { WavySliderProps } from './WavySlider.types';

type PartialSliderProps = Omit<Partial<WavySliderProps>, 'value' | 'max' | 'onChange'>;

// ============================================
// PRESET CONFIGURATIONS
// ============================================

export const PRESETS = {
  /** Spotify-like green slider */
  spotify: {
    theme: {
      activeColor: '#1DB954',
      inactiveColor: '#535353',
      thumbColor: '#1DB954',
    },
    wave: {
      amplitude: 0,
      thickness: 4,
    },
    thumb: {
      width: 12,
      height: 12,
      borderRadius: 6,
      scaleOnDrag: 1.3,
      shadow: { enabled: true, color: '#1DB954', radius: 8 },
    },
    track: { thickness: 4 },
    height: 40,
  } as PartialSliderProps,

  /** Apple Music style */
  appleMusic: {
    theme: {
      activeColor: '#FA2D48',
      inactiveColor: '#3A3A3C',
      thumbColor: '#FFFFFF',
    },
    wave: {
      amplitude: 0,
      thickness: 3,
    },
    thumb: {
      width: 6,
      height: 6,
      borderRadius: 3,
      scaleOnDrag: 2,
    },
    track: { thickness: 3 },
    gap: { enabled: false },
    height: 44,
  } as PartialSliderProps,

  /** Soundcloud waveform style */
  soundcloud: {
    theme: {
      activeColor: '#FF5500',
      inactiveColor: '#333333',
      thumbColor: '#FF5500',
    },
    wave: {
      amplitude: 12,
      frequency: 0.15,
      speed: 0,
      thickness: 3,
    },
    thumb: {
      width: 2,
      height: 30,
      borderRadius: 1,
    },
    animation: {
      waveEnabled: false,
      flattenOnDrag: false,
    },
    height: 60,
  } as PartialSliderProps,

  /** YouTube style */
  youtube: {
    theme: {
      activeColor: '#FF0000',
      inactiveColor: '#717171',
      thumbColor: '#FF0000',
    },
    wave: {
      amplitude: 0,
      thickness: 3,
    },
    thumb: {
      width: 13,
      height: 13,
      borderRadius: 7,
      scaleOnDrag: 1.2,
    },
    track: { thickness: 3 },
    gap: { enabled: false },
    height: 40,
  } as PartialSliderProps,

  /** Minimal line style */
  minimal: {
    theme: {
      activeColor: '#FFFFFF',
      inactiveColor: 'rgba(255,255,255,0.3)',
      thumbColor: '#FFFFFF',
    },
    wave: {
      amplitude: 0,
      thickness: 2,
    },
    thumb: {
      width: 4,
      height: 16,
      borderRadius: 2,
    },
    track: { thickness: 2 },
    height: 40,
  } as PartialSliderProps,

  /** Vibrant wave style */
  vibrant: {
    theme: {
      activeGradient: {
        colors: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
      },
      inactiveColor: 'rgba(255,255,255,0.15)',
      thumbGradient: {
        colors: ['#FF6B6B', '#4ECDC4'],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
      },
    },
    wave: {
      amplitude: 10,
      frequency: 0.08,
      speed: 0.12,
      thickness: 5,
    },
    thumb: {
      width: 8,
      height: 32,
      borderRadius: 4,
      scaleOnDrag: 1.3,
    },
    height: 70,
  } as PartialSliderProps,

  /** Neon glow style */
  neon: {
    theme: {
      activeColor: '#00FFFF',
      inactiveColor: '#001a1a',
      thumbColor: '#00FFFF',
    },
    wave: {
      amplitude: 8,
      frequency: 0.1,
      speed: 0.1,
      thickness: 4,
    },
    thumb: {
      width: 6,
      height: 24,
      borderRadius: 3,
      shadow: {
        enabled: true,
        color: '#00FFFF',
        radius: 12,
        opacity: 0.8,
      },
    },
    height: 60,
  } as PartialSliderProps,

  /** Ambient/relaxed style */
  ambient: {
    theme: {
      activeGradient: {
        colors: ['#667eea', '#764ba2', '#f093fb'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
      },
      inactiveColor: 'rgba(102, 126, 234, 0.2)',
      thumbColor: '#FFFFFF',
    },
    wave: {
      amplitude: 15,
      frequency: 0.05,
      speed: 0.05,
      thickness: 6,
      resolution: 1,
    },
    thumb: {
      width: 6,
      height: 36,
      borderRadius: 3,
      shadow: {
        enabled: true,
        color: '#667eea',
        radius: 10,
      },
    },
    gap: { size: 16 },
    height: 80,
  } as PartialSliderProps,

  /** Podcast player style */
  podcast: {
    theme: {
      activeColor: '#8B5CF6',
      inactiveColor: '#374151',
      thumbColor: '#8B5CF6',
    },
    wave: {
      amplitude: 4,
      frequency: 0.2,
      speed: 0.06,
      thickness: 4,
    },
    thumb: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 3,
      borderColor: '#1F2937',
    },
    height: 50,
  } as PartialSliderProps,

  /** High contrast accessible */
  accessible: {
    theme: {
      activeColor: '#FFFF00',
      inactiveColor: '#000000',
      thumbColor: '#FFFFFF',
    },
    wave: {
      amplitude: 0,
      thickness: 6,
    },
    thumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 3,
      borderColor: '#000000',
    },
    track: { thickness: 6 },
    height: 60,
  } as PartialSliderProps,
};

export type PresetName = keyof typeof PRESETS;

export const getPreset = (name: PresetName): PartialSliderProps => {
  return PRESETS[name] || PRESETS.minimal;
};

export const mergeWithPreset = (
  preset: PresetName,
  overrides?: PartialSliderProps
): PartialSliderProps => {
  const presetConfig = getPreset(preset);
  
  return {
    ...presetConfig,
    ...overrides,
    theme: { ...presetConfig.theme, ...overrides?.theme },
    wave: { ...presetConfig.wave, ...overrides?.wave },
    thumb: { ...presetConfig.thumb, ...overrides?.thumb },
    track: { ...presetConfig.track, ...overrides?.track },
    gap: { ...presetConfig.gap, ...overrides?.gap },
    animation: { ...presetConfig.animation, ...overrides?.animation },
  };
};