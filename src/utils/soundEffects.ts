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
      // Create realistic wooden ship creak with rope friction
      const oscillator = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const oscillator3 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const gainNode2 = ctx.createGain();
      const gainNode3 = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();
      const filterNode2 = ctx.createBiquadFilter();
      const noiseBuffer = this.createWoodNoiseBuffer(ctx, 0.15);
      const noiseSource = ctx.createBufferSource();
      const noiseGain = ctx.createGain();
      const noiseFilter = ctx.createBiquadFilter();

      if (noiseBuffer) {
        noiseSource.buffer = noiseBuffer;
        noiseSource.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
      }

      // Connect oscillators for complex wood texture
      oscillator.connect(filterNode);
      oscillator2.connect(filterNode2);
      oscillator3.connect(filterNode);
      filterNode.connect(gainNode);
      filterNode2.connect(gainNode2);
      filterNode.connect(gainNode3);
      gainNode.connect(ctx.destination);
      gainNode2.connect(ctx.destination);
      gainNode3.connect(ctx.destination);

      // Configure realistic ship wood creak - three layers
      oscillator.type = 'sawtooth';  // Main wood fiber stress
      oscillator2.type = 'triangle'; // Wood grain resonance
      oscillator3.type = 'square';   // Sharp crack component
      
      // Main wood stress creak (deep to high stress, then release)
      oscillator.frequency.setValueAtTime(95, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(280, ctx.currentTime + 0.03);
      oscillator.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.25);
      
      // Wood grain resonance (slower, deeper)
      oscillator2.frequency.setValueAtTime(140, ctx.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.2);
      
      // Sharp crack/snap component (brief)
      oscillator3.frequency.setValueAtTime(450, ctx.currentTime);
      oscillator3.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);

      // Heavy filtering for authentic wood resonance
      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(320, ctx.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
      filterNode.Q.setValueAtTime(4, ctx.currentTime);
      
      // Secondary filter for grain resonance
      filterNode2.type = 'bandpass';
      filterNode2.frequency.setValueAtTime(180, ctx.currentTime);
      filterNode2.Q.setValueAtTime(8, ctx.currentTime);

      // Rope/wood friction noise
      if (noiseBuffer) {
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(250, ctx.currentTime);
        noiseFilter.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.1);
        noiseFilter.Q.setValueAtTime(12, ctx.currentTime);
        
        noiseGain.gain.setValueAtTime(0, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        
        noiseSource.start(ctx.currentTime);
        noiseSource.stop(ctx.currentTime + 0.12);
      }

      // Main wood stress envelope (slow attack, long decay)
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      
      // Wood grain resonance envelope
      gainNode2.gain.setValueAtTime(0, ctx.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.03);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      
      // Sharp crack envelope (quick attack, fast decay)
      gainNode3.gain.setValueAtTime(0, ctx.currentTime);
      gainNode3.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.005);
      gainNode3.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.28);
      oscillator2.start(ctx.currentTime);
      oscillator2.stop(ctx.currentTime + 0.22);
      oscillator3.start(ctx.currentTime);
      oscillator3.stop(ctx.currentTime + 0.08);
    } catch (error) {
      console.warn('Error playing select sound:', error);
    }
  }

  // Deeper wooden sound for deselection
  async playDeselectSound() {
    const ctx = await this.ensureAudioContext();
    if (!ctx) return;

    try {
      // Create realistic wood settling with rope release
      const oscillator = ctx.createOscillator();
      const oscillator2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const gainNode2 = ctx.createGain();
      const filterNode = ctx.createBiquadFilter();
      const noiseBuffer = this.createWoodNoiseBuffer(ctx, 0.12);
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
      oscillator2.connect(filterNode);
      filterNode.connect(gainNode);
      filterNode.connect(gainNode2);
      gainNode.connect(ctx.destination);
      gainNode2.connect(ctx.destination);

      // Deep wood settling with harmonic
      oscillator.type = 'sawtooth';
      oscillator2.type = 'triangle';
      
      // Main settling frequency (wood relaxing)
      oscillator.frequency.setValueAtTime(85, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.3);
      
      // Harmonic settling
      oscillator2.frequency.setValueAtTime(170, ctx.currentTime);
      oscillator2.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 0.25);

      filterNode.type = 'lowpass';
      filterNode.frequency.setValueAtTime(200, ctx.currentTime);
      filterNode.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.2);
      filterNode.Q.setValueAtTime(3, ctx.currentTime);

      // Rope/wood friction release
      if (noiseBuffer) {
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(150, ctx.currentTime);
        noiseFilter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15);
        
        noiseGain.gain.setValueAtTime(0, ctx.currentTime);
        noiseGain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 0.04);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
        
        noiseSource.start(ctx.currentTime);
        noiseSource.stop(ctx.currentTime + 0.18);
      }

      // Main settling envelope
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
      
      // Harmonic envelope
      gainNode2.gain.setValueAtTime(0, ctx.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.04);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.32);
      oscillator2.start(ctx.currentTime);
      oscillator2.stop(ctx.currentTime + 0.28);
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
  private createWoodNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer | null {
    try {
      const sampleRate = ctx.sampleRate;
      const bufferSize = sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate realistic wood/rope friction noise
      let lastValue = 0;
      for (let i = 0; i < bufferSize; i++) {
        // Create correlated noise for more realistic wood texture
        const white = (Math.random() * 2 - 1);
        const brown = (lastValue + (0.02 * white)) / 1.02;
        lastValue = brown;
        
        // Add occasional sharp spikes for wood fiber snaps
        const spike = Math.random() < 0.001 ? (Math.random() * 0.3) : 0;
        
        data[i] = (brown * 0.8 + spike) * 0.15;
      }
      
      return buffer;
    } catch (error) {
      console.warn('Could not create wood noise buffer:', error);
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