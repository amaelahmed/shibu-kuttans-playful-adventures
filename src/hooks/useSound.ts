
import { useEffect } from 'react';
import { soundManager } from '@/utils/soundManager';

export const useSound = () => {
  useEffect(() => {
    // Initialize sounds on first use
    const initSounds = () => {
      soundManager.initSounds();
      document.removeEventListener('click', initSounds);
    };

    // Wait for user interaction to initialize audio
    document.addEventListener('click', initSounds, { once: true });

    return () => {
      document.removeEventListener('click', initSounds);
    };
  }, []);

  return {
    playSound: (soundName: string) => soundManager.playSound(soundName),
    setSfxVolume: (volume: number) => soundManager.setSfxVolume(volume)
  };
};
