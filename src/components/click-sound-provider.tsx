'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { Howl } from 'howler';
import { sounds } from '@/data/sounds';

interface ClickSoundContextProps {
  soundEnabled: boolean;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  volume: number;
  playTestSound: () => void;
  playSoundById: (soundUrl: string) => void;
  sounds: typeof sounds;
}

const ClickSoundContext = createContext<ClickSoundContextProps>({
  soundEnabled: true,
  toggleSound: () => {},
  setVolume: () => {},
  volume: 0.3,
  playTestSound: () => {},
  playSoundById: () => {},
  sounds: sounds,
});

const clickSound = new Howl({
  src: ['/sounds/click.mp3'],
  volume: 0.3,
  preload: true,
});

let globalVolume = 0.3;

/**
 * Provider component that sets up global click sounds
 * This provider automatically attaches click sounds to all interactive elements
 */
export function ClickSoundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const documentRef = useRef<Document | null>(null);

  const setVolume = (volumeLevel: number) => {
    try {
      const normalizedVolume = Math.max(0, Math.min(100, volumeLevel)) / 100;

      globalVolume = normalizedVolume;

      clickSound.volume(normalizedVolume);
    } catch (error) {
      console.error('Error setting click sound volume:', error);
    }
  };

  const playSoundById = (soundUrl: string) => {
    if (!soundEnabled) return;

    try {
      const sound = new Howl({
        src: [soundUrl],
        volume: globalVolume,
      });
      sound.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleGlobalClick = useCallback(
    (e: MouseEvent) => {
      if (!soundEnabled) return;

      const target = e.target as HTMLElement;

      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.getAttribute('role') === 'button' ||
        target.getAttribute('aria-role') === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.closest('[role="button"]') ||
        target.closest('.cursor-pointer') ||
        target.closest('button') ||
        target.closest('a');

      if (isInteractive) {
        try {
          clickSound.volume(globalVolume);

          clickSound.play();
        } catch (error) {
          console.error('Error playing click sound:', error);
        }
      }
    },
    [soundEnabled]
  );

  const playTestSound = () => {
    if (soundEnabled) {
      try {
        clickSound.volume(globalVolume);

        clickSound.play();
        return true;
      } catch (error) {
        console.error('Error playing test click sound:', error);
      }
    }
    return null;
  };

  // Toggle sound on/off
  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      documentRef.current = document;
      document.addEventListener('click', handleGlobalClick);

      return () => {
        document.removeEventListener('click', handleGlobalClick);
      };
    }
  }, [soundEnabled, handleGlobalClick]);

  useEffect(() => {}, []);

  return (
    <ClickSoundContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        setVolume,
        volume: globalVolume,
        playTestSound,
        playSoundById,
        sounds,
      }}
    >
      {children}
    </ClickSoundContext.Provider>
  );
}

// Hook to access sound settings
export function useClickSound() {
  return useContext(ClickSoundContext);
}
