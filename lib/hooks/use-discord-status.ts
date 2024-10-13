/*
Taken from my previous project "terminal-site"
https://github.com/Trixzyy/terminal-site/blob/main/src/hooks/useDiscordStatus.ts
Modfied to work with my current project. (custom staus, emojis)
*/

// use-discord-status.ts
import { useState, useEffect } from 'react';

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
}

interface Activity {
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

interface SpotifyData {
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
  timestamps: {
    start: number;
    end: number;
  };
}

interface CustomStatus {
  state?: string;
  emoji?: {
    name: string;
    id: string;
    animated: boolean;
  };
}

interface DiscordStatus {
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  discord_user: DiscordUser;
  activities: Activity[];
  spotify?: SpotifyData;
  custom_status?: CustomStatus;
}

const DISCORD_ID = '992171799536218142';

export const useDiscordStatus = () => {
  const [discordStatus, setDiscordStatus] = useState<DiscordStatus | null>(null);
  const [customStatus, setCustomStatus] = useState<CustomStatus | null>(null);
  const [music, setMusic] = useState<SpotifyData | null>(null);

  useEffect(() => {
    const socket = new WebSocket('wss://api.lazerjay.dev/api/lanyard/socket/');

    const handleOpen = () => {
      socket.send(JSON.stringify({
        op: 2,
        d: {
          subscribe_to_id: DISCORD_ID
        }
      }));
    };

    const handleMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE') {
        setDiscordStatus(data.d);

        // Handle custom status
        const customStatusActivity = data.d.activities.find((activity: Activity) => activity.type === 4);
        if (customStatusActivity) {
          setCustomStatus({
            state: customStatusActivity.state,
            emoji: customStatusActivity.emoji
          });
        } else {
          setCustomStatus(null);
        }

        // Handle Spotify data
        if (data.d.spotify) {
          setMusic({
            song: data.d.spotify.song,
            artist: data.d.spotify.artist,
            album: data.d.spotify.album,
            album_art_url: data.d.spotify.album_art_url,
            timestamps: data.d.spotify.timestamps
          });
        } else {
          setMusic(null);
        }
      }
    };

    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('message', handleMessage);
      socket.close();
    };
  }, []);

  return {
    discordStatus,
    customStatus,
    music,
    avatar: discordStatus?.discord_user.avatar 
      ? `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${discordStatus.discord_user.avatar}?size=256`
      : null,
    username: discordStatus?.discord_user.username,
    activities: discordStatus?.activities.filter(activity => activity.type !== 4) || [],
  };
};