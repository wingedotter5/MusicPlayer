import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Track } from '../../types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../colors';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
} from 'react-native-track-player';
import { tracks } from '../../data';
import Feather from 'react-native-vector-icons/Feather';

interface Props {
  track: Track;
}

const { width: windowWidth } = Dimensions.get('window');
const trackWidth = windowWidth / 2.5;

export default function TrackCard({ track }: Props) {
  const activeTrack = useActiveTrack();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const isBuffering = playbackState.state === State.Buffering;
  const isCurrentTrack = track.id === activeTrack?.id;

  const playPauseTrack = async () => {
    if (isCurrentTrack) {
      if (isPlaying) {
        TrackPlayer.pause();
      } else {
        TrackPlayer.play();
      }
      return;
    }

    await TrackPlayer.reset();
    await TrackPlayer.add([
      track,
      ...tracks.filter(_track => _track.id !== track.id),
    ]);
    await TrackPlayer.play();
  };

  return (
    <View style={styles.trackCard}>
      <View>
        <Image
          source={{
            uri: track.artwork ?? 'https://picsum.photos/400',
          }}
          resizeMode="cover"
          style={styles.artwork}
        />
        <TouchableOpacity onPress={playPauseTrack} style={styles.button}>
          {isBuffering && isCurrentTrack ? (
            <Feather name="loader" size={20} color={colors.primaryText} />
          ) : (
            <MaterialCommunityIcons
              name={isPlaying && isCurrentTrack ? 'pause' : 'play'}
              size={20}
              color={colors.primaryText}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {track.artist ?? '(Unknown artist)'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  trackCard: {
    width: trackWidth,
    rowGap: 8,
  },

  artworkWrapper: {},
  artwork: {
    width: '100%',
    height: trackWidth * 1.25,
  },
  button: {
    position: 'absolute',
    backgroundColor: '#00000088',
    padding: 8,
    bottom: 8,
    right: 8,
    borderRadius: 1000,
  },

  info: {},
  trackTitle: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: 'semibold',
  },
  trackArtist: {
    color: colors.secondaryText,
  },
});
