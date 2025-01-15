import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import TrackCard from '../../src/components/TrackCard';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  State,
} from 'react-native-track-player';

const mockTrack = {
  id: '1',
  title: 'title1',
  url: 'url1',
};

const mockedUsePlaybackState = jest.mocked(usePlaybackState);
const mockedUseActiveTrack = jest.mocked(useActiveTrack);

describe('TrackCard', () => {
  beforeAll(() => {
    mockedUseActiveTrack.mockReturnValue(mockTrack);
  });

  it('on clicking playPauseBtn pauses when it is the current track and playing', () => {
    mockedUsePlaybackState.mockReturnValueOnce({
      state: State.Playing,
    });

    render(<TrackCard track={mockTrack} />);

    fireEvent(screen.getByTestId('playPauseBtn'), 'press');

    expect(TrackPlayer.pause).toHaveBeenCalled();
  });

  it('on clicking playPauseBtn plays when it is the current track and paused', () => {
    mockedUsePlaybackState.mockReturnValueOnce({
      state: State.Paused,
    });

    render(<TrackCard track={mockTrack} />);

    fireEvent(screen.getByTestId('playPauseBtn'), 'press');

    expect(TrackPlayer.play).toHaveBeenCalled();
  });

  it('on clicking playPauseBtn resets the queue and starts playing from the beginning if not the current track', async () => {
    mockedUsePlaybackState.mockReturnValueOnce({
      state: State.None,
    });

    const otherTrack = {
      id: 'id2',
      title: 'title2',
      url: 'url2',
    };
    render(<TrackCard track={otherTrack} />);

    fireEvent(screen.getByTestId('playPauseBtn'), 'press');

    await waitFor(() => {
      expect(TrackPlayer.reset).toHaveBeenCalled();
      expect(TrackPlayer.add).toHaveBeenCalled();
      expect(TrackPlayer.play).toHaveBeenCalled();
    });
  });
});
