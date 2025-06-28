
class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};
  private sfxVolume = 0.5;

  constructor() {
    // Initialize audio context on first user interaction
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.log('Web Audio API not supported');
    }
  }

  // Create simple tones for sound effects
  private createTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer {
    if (!this.audioContext) return new AudioBuffer({ length: 1, sampleRate: 44100 });
    
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let value = 0;
      
      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'triangle':
          value = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
          break;
      }
      
      // Apply envelope
      const envelope = Math.exp(-t * 3);
      data[i] = value * envelope;
    }

    return buffer;
  }

  // Initialize sound effects
  initSounds() {
    if (!this.audioContext) return;

    // Create various sound effects
    this.sounds.click = this.createTone(800, 0.1, 'sine');
    this.sounds.success = this.createTone(600, 0.3, 'sine');
    this.sounds.wrong = this.createTone(200, 0.2, 'square');
    this.sounds.levelComplete = this.createTone(523.25, 0.5, 'sine'); // C5
    this.sounds.star = this.createTone(880, 0.2, 'triangle'); // A5
    this.sounds.badge = this.createTone(659.25, 0.4, 'sine'); // E5
  }

  // Play a sound effect
  playSound(soundName: string) {
    if (!this.audioContext || !this.sounds[soundName]) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.sounds[soundName];
      gainNode.gain.value = this.sfxVolume;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
    } catch (error) {
      console.log('Could not play sound:', error);
    }
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();
