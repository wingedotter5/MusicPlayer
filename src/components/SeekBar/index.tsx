import { View, StyleSheet, Text } from 'react-native';
import colors from '../../colors';
import { useProgress } from 'react-native-track-player';

export default function SeekBar({ showTime = true }: { showTime?: boolean }) {
  const { position, duration, buffered } = useProgress();

  const progressPercent = (position / duration) * 100;
  const bufferedPercent = (buffered / duration) * 100;

  return (
    <View>
      <View style={styles.playerTrack}>
        {
          <View
            style={[
              styles.bufferTrack,
              {
                width: `${bufferedPercent}%`,
              },
            ]}>
            <View
              style={[
                styles.progressTrack,
                {
                  width: `${progressPercent}%`,
                },
              ]}
            />
          </View>
        }
      </View>
      {showTime ? (
        <View style={styles.time}>
          <Text style={styles.text}>{formatSeconds(position)}</Text>
          <Text style={styles.text}>{formatSeconds(duration)}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  playerTrack: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  bufferTrack: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  progressTrack: {
    height: '100%',
    backgroundColor: '#fff',
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  text: {
    color: colors.secondaryText,
  },
});

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toFixed(0)
    .toString()
    .padStart(2, '0')}`;
}
