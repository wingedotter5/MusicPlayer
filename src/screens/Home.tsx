import { ScrollView, FlatList, View, StyleSheet, Text } from 'react-native';
import { tracks } from '../data';
import TrackCard from '../components/TrackCard';
import Player from '../components/Player';
import colors from '../colors';

export default function Home() {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Trending</Text>
        <FlatList
          horizontal
          data={tracks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TrackCard track={item} />}
          contentContainerStyle={{ columnGap: 16, padding: 16 }}
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
      <Player />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  heading: {
    color: colors.primaryText,
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
  },
});
