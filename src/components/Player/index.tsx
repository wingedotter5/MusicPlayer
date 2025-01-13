import {
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ImageBackground,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Fragment, useState } from 'react';
import SeekBar from '../SeekBar';
import colors from '../../colors';
import TrackPlayer, {
  useActiveTrack,
  useProgress,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import Feather from 'react-native-vector-icons/Feather';

const placeholderArtwork = 'https://picsum.photos/400';

export default function Player() {
  const [exapanded, setExpanded] = useState(false);
  const activeTrack = useActiveTrack();
  const { position } = useProgress();
  const playbackState = usePlaybackState();
  const isPlaying = playbackState.state === State.Playing;
  const isBuffering = playbackState.state === State.Buffering;

  const openModal = () => setExpanded(true);

  const closeModal = () => setExpanded(false);

  const playPause = async () => {
    if (isBuffering) {
      return;
    }

    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  const playNext = async () => {
    await TrackPlayer.skipToNext();
    await TrackPlayer.play();
  };

  const playPrevious = async () => {
    if (position >= 10) {
      await TrackPlayer.seekTo(0);
      return;
    }

    await TrackPlayer.skipToPrevious();
    await TrackPlayer.play();
  };

  if (!activeTrack) {
    return null;
  }

  return (
    <Fragment>
      <Pressable onPress={openModal}>
        <SeekBar showTime={false} />
        <View style={styles.player}>
          <Image
            source={{ uri: activeTrack.artwork ?? placeholderArtwork }}
            style={styles.trackArtwork}
          />
          <View style={styles.info1}>
            <Text style={styles.info1TrackTitle} numberOfLines={1}>
              {activeTrack.title}
            </Text>
            <Text style={styles.info1TrackArtist} numberOfLines={1}>
              {activeTrack.artist ?? '(Unknown artist)'}
            </Text>
          </View>
          <View style={styles.controls1}>
            <TouchableOpacity onPress={playPause}>
              {isBuffering ? (
                <Feather name="loader" size={24} color={colors.primaryText} />
              ) : (
                <MaterialCommunityIcons
                  name={isPlaying ? 'pause' : 'play'}
                  size={24}
                  color={colors.primaryText}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={playNext}>
              <MaterialCommunityIcons
                name="skip-next"
                size={24}
                color={colors.primaryText}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
      <Modal
        visible={exapanded}
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.header}>
          <Pressable onPress={closeModal}>
            <MaterialCommunityIcons
              name="chevron-down"
              size={28}
              color={colors.primaryText}
            />
          </Pressable>
          <Pressable>
            <MaterialCommunityIcons
              name="dots-vertical"
              size={28}
              color={colors.primaryText}
            />
          </Pressable>
        </View>
        <View>
          <View style={styles.top}>
            <ImageBackground
              source={{ uri: activeTrack.artwork ?? placeholderArtwork }}
              blurRadius={10}
              style={styles.artworkBackground}>
              <Image
                source={{ uri: activeTrack.artwork ?? placeholderArtwork }}
                style={styles.artwork}
              />
            </ImageBackground>
          </View>
          <View style={styles.bottom}>
            <View style={styles.info2}>
              <Text style={styles.info2TrackTitle} numberOfLines={2}>
                {activeTrack.title}
              </Text>
              <Text style={styles.info2TrackArtist} numberOfLines={2}>
                {activeTrack.artist ?? '(Unknown artist)'}
              </Text>
            </View>
            <SeekBar />
            <View style={styles.controls2}>
              <TouchableOpacity>
                <Ionicons
                  name="shuffle-outline"
                  size={32}
                  color={colors.primaryText}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={playPrevious}>
                <MaterialCommunityIcons
                  name="skip-previous"
                  size={32}
                  color={colors.primaryText}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={playPause} style={styles.button}>
                {isBuffering ? (
                  <Feather name="loader" size={40} color="#000" />
                ) : (
                  <MaterialCommunityIcons
                    name={isPlaying ? 'pause' : 'play'}
                    size={40}
                    color="#000"
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={playNext}>
                <MaterialCommunityIcons
                  name="skip-next"
                  size={32}
                  color={colors.primaryText}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons
                  name="repeat-sharp"
                  size={32}
                  color={colors.primaryText}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  player: {
    backgroundColor: colors.secondaryBg,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  trackArtwork: {
    width: 56,
    height: 56,
    backgroundColor: colors.primaryBg,
  },
  info1: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-evenly',
  },
  info1TrackTitle: {
    color: colors.primaryText,
    fontSize: 16,
  },
  info1TrackArtist: {
    color: colors.secondaryText,
  },
  controls1: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 32,
  },
  button: {
    borderRadius: 1000,
    backgroundColor: colors.primaryText,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.primaryBg,
  },
  top: {
    height: '50%',
  },
  artworkBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artwork: {
    width: '75%',
    height: '75%',
  },
  bottom: {
    height: '50%',
    backgroundColor: colors.primaryBg,
    padding: 32,
    justifyContent: 'center',
    rowGap: 32,
  },
  info2: {},
  info2TrackTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  info2TrackArtist: {
    color: colors.secondaryText,
    fontSize: 18,
  },
  controls2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controls2Middle: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 16,
  },
});
