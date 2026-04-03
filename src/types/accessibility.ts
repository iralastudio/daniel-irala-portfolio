export type TextScale = 'normal' | 'large' | 'extra-large';

export interface AccessibilitySettings {
    dyslexiaFont: boolean;
    reduceMotion: boolean;
    highContrast: boolean;
    textToVoice: boolean;
    textScale: TextScale;
}
