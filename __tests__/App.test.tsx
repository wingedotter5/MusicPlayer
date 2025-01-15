import { render, waitFor } from '@testing-library/react-native';
import App from '../App';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
  Capability,
} from 'react-native-track-player';

const mockedUseActiveTrack = jest.mocked(useActiveTrack);
const mockedUsePlaybackState = jest.mocked(usePlaybackState);
const mockedUseProgress = jest.mocked(useProgress);

it('correctly intializes track player on mount', async () => {
  mockedUseActiveTrack.mockReturnValue(undefined);
  mockedUsePlaybackState.mockReturnValue({
    state: State.None,
  });
  mockedUseProgress.mockReturnValue({
    position: 0,
    duration: 0,
    buffered: 0,
  });

  render(<App />);

  await waitFor(() => {
    expect(TrackPlayer.setupPlayer).toHaveBeenCalled();
    expect(TrackPlayer.updateOptions).toHaveBeenCalled();
    expect(TrackPlayer.updateOptions).toHaveBeenCalledWith({
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
  });
});
