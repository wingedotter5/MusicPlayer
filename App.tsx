import Home from './src/screens/Home';
import { useEffect } from 'react';
import TrackPlayer, { Capability } from 'react-native-track-player';

export default function App() {
  useEffect(() => {
    async function setup() {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
          // Media controls capabilities
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],

          // Capabilities that will show up when the notification is in the compact form on Android
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
      } catch (error) {}
    }

    setup();
  }, []);

  return <Home />;
}
