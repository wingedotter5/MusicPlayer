import { render } from '@testing-library/react-native';
import SeekBar from '../../src/components/SeekBar';
import { useProgress } from 'react-native-track-player';

const mockedUseProgress = jest.mocked(useProgress);

describe('SeekBar', () => {
  it('renders correctly', () => {
    mockedUseProgress.mockReturnValue({
      position: 0,
      buffered: 0,
      duration: 0,
    });
    render(<SeekBar />);
  });
});
