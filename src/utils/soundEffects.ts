// Professional nautical sound effects for Casus Columbus
// Using Web Audio API for high-quality, programmatically generated sounds

class SoundEffects {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Initialize AudioContext on first user interaction
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.isEnabled = false;
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext || !this.isEnabled) return null;
    
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Could not resume audio context:', error);
        return null;
      }
    }
    
    return this.audioContext;
  }

  // Subtle wooden click sound for button selections
  async playSelectSound() {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      // Create a subtle wooden click sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();

      // Connect nodes
      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Configure wooden click sound
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.1);

      // Low-pass filter for wooden tone
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(1200, ctx.currentTime);
      filterNode.Q.setValueAtTime(2, ctx.currentTime);

      // Quick attack, fast decay for click effect
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.12);
    } catch (error) {
      console.warn('Error playing select sound:', error);
    }
  }

  // Deeper wooden sound for deselection
  async playDeselectSound() {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();

      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Deeper, softer deselect sound
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15);

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(800, ctx.currentTime);
      filterNode.Q.setValueAtTime(1.5, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.18);
    } catch (error) {
      console.warn('Error playing deselect sound:', error);
    }
  }

  // Confirmation sound for important actions
  async playConfirmSound() {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      // Create a pleasant confirmation chord
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();

      gainNode.connect(filterNode);
      filterNode.connect(ctx.destination);

      // Warm filter settings
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(2000, ctx.currentTime);
      filterNode.Q.setValueAtTime(1, ctx.currentTime);

      // Envelope for pleasant confirmation
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      // Create chord
      frequencies.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        
        osc.connect(oscGain);
        oscGain.connect(gainNode);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        // Slightly different volumes for natural chord
        oscGain.gain.setValueAtTime(index === 0 ? 0.4 : 0.3, ctx.currentTime);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      });
    } catch (error) {
      console.warn('Error playing confirm sound:', error);
    }
  }

  // Navigation sound for page transitions
  async playNavigationSound() {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();

      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Gentle swoosh-like navigation sound
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(300, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.2);

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(1500, ctx.currentTime);
      filterNode.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.2);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.25);
    } catch (error) {
      console.warn('Error playing navigation sound:', error);
    }
  }

  // Toggle sound effects on/off
  toggleSounds(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Check if sounds are enabled
  isAudioEnabled(): boolean {
    return this.isEnabled && this.audioContext !== null;
  }
}

// Create singleton instance
export const soundEffects = new SoundEffects();

// Utility functions for easy use in components
export const playSelectSound = () => soundEffects.playSelectSound();
export const playDeselectSound = () => soundEffects.playDeselectSound();
export const playConfirmSound = () => soundEffects.playConfirmSound();
export const playNavigationSound = () => soundEffects.playNavigationSound();