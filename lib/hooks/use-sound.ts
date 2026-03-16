import useSound_ from "use-sound";
import { useMediaQuery } from "./use-media-query";

interface HookOptions {
  id?: string;
  volume?: number;
  playbackRate?: number;
  interrupt?: boolean;
  soundEnabled?: boolean;
  sprite?: { [key: string]: [number, number] };
  onload?: () => void;
}

interface PlayOptions {
  id?: string;
  forceSoundEnabled?: boolean;
  playbackRate?: number;
}

type PlayFunction = (options?: PlayOptions) => void;

export function useSound(path: string, options?: HookOptions): PlayFunction {
  const isTouchDevice = useMediaQuery("(hover: none)");
  const isTinyDevice = useMediaQuery("(max-width: 480px)");
  const isMobile = isTouchDevice || isTinyDevice;

  const [play] = useSound_(path, {
    soundEnabled: !isMobile,
    ...options,
  });

  return play;
}
