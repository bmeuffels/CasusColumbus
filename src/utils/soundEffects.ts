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
      // Create a realistic wooden creak/scrape sound
      const oscillator = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const gainNode2 = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();
      const noiseBuffer = this.createNoiseBuffer(ctx, 0.1);
      const noiseSource = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();

      if (noiseBuffer) {
        noiseSource.buffer = noiseBuffer;
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
      }

      // Connect oscillator nodes
      oscillator.connect(filterNode);
      oscillator2.connect(filterNode);
      filterNode.connect(gainNode);
      filterNode.connect(gainNode2);
      gainNode.connect(ctx.destination);
      gainNode2.connect(ctx.destination);

      // Configure wooden creak sound - two oscillators for complexity
      oscillator.type = 'sawtooth';
      oscillator2.type = 'square';
      
      // Main creak frequency sweep
      oscillator.frequency.setValueAtTime(180, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.02);
      oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
      
      // Secondary harmonic for wood texture
      oscillator2.frequency.setValueAtTime(360, ctx.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.12);

      // Heavy filtering for wooden, muffled tone
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(400, ctx.currentTime);
      filterNode.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.1);
      filterNode.Q.setValueAtTime(3, ctx.currentTime);

      // Noise component for scraping texture
      if (noiseBuffer) {
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(300, ctx.currentTime);
        noiseFilter.Q.setValueAtTime(10, ctx.currentTime);
        
        noiseGain.gain.setValueAtTime(0, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.01);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        
        noiseSource.start(ctx.currentTime);
        noiseSource.stop(ctx.currentTime + 0.08);
      }

      // Envelope for wooden creak
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      
      gainNode2.gain.setValueAtTime(0, ctx.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.01);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.18);
      oscillator2.start(ctx.currentTime);
      oscillator2.stop(ctx.currentTime + 0.15);
    } catch (error) {
      console.warn('Error playing select sound:', error);
    }
  }

  // Deeper wooden sound for deselection
  async playDeselectSound() {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      // Create a deeper wood settling sound
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();
      const noiseBuffer = this.createNoiseBuffer(ctx, 0.08);
      const noiseSource = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();

      if (noiseBuffer) {
        noiseSource.buffer = noiseBuffer;
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
      }

      oscillator.connect(filterNode);
      filterNode.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Deeper wood settling sound
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(120, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2);

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(250, ctx.currentTime);
      filterNode.Q.setValueAtTime(2, ctx.currentTime);

      // Subtle noise for texture
      if (noiseBuffer) {
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(200, ctx.currentTime);
        
        noiseGain.gain.setValueAtTime(0, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.03);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        noiseSource.start(ctx.currentTime);
        noiseSource.stop(ctx.currentTime + 0.15);
      }

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.22);
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

  // Helper method to create noise buffer for texture
  private createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer | null {
    try {
      const sampleRate = ctx.sampleRate;
      const bufferSize = sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate filtered noise for wood texture
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1;
      }
      
      return buffer;
    } catch (error) {
      console.warn('Could not create noise buffer:', error);
      return null;
    }
  }
}

// Create singleton instance
export const soundEffects = new SoundEffects();

// Utility functions for easy use in components
export const playSelectSound = () => soundEffects.playSelectSound();
export const playDeselectSound = () => soundEffects.playDeselectSound();
export const playConfirmSound = () => soundEffects.playConfirmSound();
export const playNavigationSound = () => soundEffects.playNavigationSound();