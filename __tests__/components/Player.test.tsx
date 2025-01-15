import { fireEvent, render, screen } from '@testing-library/react-native';
import Player from '../../src/components/Player';
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  useProgress,
  State,
} from 'react-native-track-player';

const mockTrack = {
  id: 'id1',
  title: 'title1',
  url: 'url1',
};

const mockedUseActiveTrack = jest.mocked(useActiveTrack);
const mockedUsePlaybackState = jest.mocked(usePlaybackState);
const mockedUseProgress = jest.mocked(useProgress);

describe('Player', () => {
  beforeAll(() => {
    mockedUseActiveTrack.mockReturnValue(mockTrack);
    mockedUsePlaybackState.mockReturnValue({
      state: State.None,
    });
    mockedUseProgress.mockReturnValue({
      position: 0,
      duration: 0,
      buffered: 0,
    });
  });

  afterEach(() => {
    (TrackPlayer.play as jest.Mock).mockReset();
    (TrackPlayer.pause as jest.Mock).mockReset();
    (TrackPlayer.skipToPrevious as jest.Mock).mockReset();
  });

  it('renders nothing when not playing', () => {
    mockedUseActiveTrack.mockReturnValueOnce(undefined);
    mockedUsePlaybackState.mockReturnValueOnce({ state: undefined });

    render(<Player />);

    expect(screen.queryByTestId('collapsedPlayer')).not.toBeOnTheScreen();
  });

  it('on clicking playPauseBtn1 pauses playing', () => {
    mockedUsePlaybackState.mockReturnValueOnce({
      state: State.Playing,
    });

    render(<Player />);

    fireEvent(screen.getByTestId('playPauseBtn1'), 'press');

    expect(TrackPlayer.pause).toHaveBeenCalled();
  });

  it('on clicking playPauseBtn1 resumes playing', () => {
    mockedUsePlaybackState.mockReturnValueOnce({
      state: State.Paused,
    });

    render(<Player />);

    fireEvent(screen.getByTestId('playPauseBtn1'), 'press');

    expect(TrackPlayer.play).toHaveBeenCalled();
  });

  it('on clicking playPauseBtn1 while buffering does nothing', () => {
    mockedUsePlaybackState.mockReturnValueOnce({
      state: State.Buffering,
    });

    render(<Player />);

    fireEvent(screen.getByTestId('playPauseBtn1'), 'press');

    expect(TrackPlayer.play).not.toHaveBeenCalled();
    expect(TrackPlayer.pause).not.toHaveBeenCalled();
  });

  it('on clicking nextBtn1 skips to the next track', () => {
    render(<Player />);

    fireEvent(screen.getByTestId('nextBtn1'), 'press');

    expect(TrackPlayer.skipToNext).toHaveBeenCalled();
  });

  it('on clicking prevBtn2 skips to the previous track', async () => {
    render(<Player />);

    // Expand the modal
    fireEvent(screen.getByTestId('collapsedPlayer'), 'press');

    fireEvent(screen.getByTestId('prevBtn2'), 'press');

    expect(TrackPlayer.skipToPrevious).toHaveBeenCalled();
  });

  it('on clicking prevBtn2 seeks to the start when atleast 10 seconds have elapsed', () => {
    render(<Player />);

    mockedUseProgress.mockReturnValueOnce({
      position: 10,
      duration: 0,
      buffered: 0,
    });

    // Expand the modal
    fireEvent(screen.getByTestId('collapsedPlayer'), 'press');

    fireEvent(screen.getByTestId('prevBtn2'), 'press');

    expect(TrackPlayer.seekTo).toHaveBeenCalled();
    expect(TrackPlayer.seekTo).toHaveBeenCalledWith(0);
    expect(TrackPlayer.skipToPrevious).not.toHaveBeenCalled();
  });

  it('player modal can be closed', () => {
    render(<Player />);

    // Expand the modal
    fireEvent(screen.getByTestId('collapsedPlayer'), 'press');

    expect(screen.getByTestId('expandedPlayer')).toBeOnTheScreen();

    // Close the modal
    fireEvent(screen.getByTestId('closeModalBtn'), 'press');

    expect(screen.queryByTestId('expandedPlayer')).not.toBeOnTheScreen();
  });
});
