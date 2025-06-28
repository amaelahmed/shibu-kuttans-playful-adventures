
class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};
  private musicVolume = 0.3;
  private sfxVolume = 0.5;
  private currentMusic: AudioBufferSourceNode | null = null;

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

  // Play background music (simple melody loop)
  playBackgroundMusic() {
    if (!this.audioContext) return;

    this.stopBackgroundMusic();

    try {
      // Create a simple cheerful melody
      const melody = [523.25, 587.33, 659.25, 698.46, 783.99]; // C-D-E-F-G
      let noteIndex = 0;

      const playNote = () => {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.frequency.setValueAtTime(melody[noteIndex], this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(this.musicVolume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.8);

        noteIndex = (noteIndex + 1) % melody.length;
        
        setTimeout(playNote, 1000);
      };

      playNote();
    } catch (error) {
      console.log('Could not play background music:', error);
    }
  }

  stopBackgroundMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();
