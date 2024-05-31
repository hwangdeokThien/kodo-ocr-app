import { Image, StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { useState } from 'react';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Note from '@/components/Note';
import { Ionicons } from '@expo/vector-icons';
import staticData from '@/data/note';
import { loadFonts } from '@/components/Fonts';

const screenWidth = Dimensions.get('screen').width;

export default function HomeScreen() {
  const fontsLoaded = loadFonts();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState(staticData);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = staticData.filter((note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.body.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(staticData);
    }
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    setSortModalVisible(false);

    const sortedNotes = [...filteredNotes].sort((a, b) => {
      const dateA = new Date(a.accessedDate).getTime();
      const dateB = new Date(b.accessedDate).getTime();
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotes(sortedNotes);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FEFDED', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/app-background.png')}
          style={{}}
        />
      }>
      <Text style={styles.homeText}> Your Note</Text>

      <View style={styles.searchAndFilter}>
        <View style={styles.searchBox}>
          <Ionicons name='search-outline' style={{ fontSize: 20, color: 'grey' }} />
          <TextInput
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity onPress={() => setSortModalVisible(true)}>
          <Ionicons name='filter' style={{ fontSize: 25, color: 'grey' }} />
        </TouchableOpacity>
      </View>

      <View style={styles.homeBody}>
        {filteredNotes.map((note, index) => (
          <Note key={index} title={note.title} body={note.body} accessedDate={note.accessedDate} />
        ))}
      </View>

      <Modal
        transparent={true}
        visible={sortModalVisible}
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleSort('newest')} style={styles.modalOption}>
              <Text style={styles.modalText}>Newest First</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSort('oldest')} style={styles.modalOption}>
              <Text style={styles.modalText}>Oldest First</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSortModalVisible(false)} style={styles.modalOption}>
              <Text style={styles.modalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  homeText: {
    color: '#4F6F52',
    fontFamily: 'Dosis-ExtraBold',
    fontSize: 40,
    shadowColor: '#4F6F52',
    shadowOpacity: 0.12,
  },
  homeBody: {
    marginTop: 10,
    gap: 15,
  },
  searchAndFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBox: {
    flexDirection: 'row',
    height: 40,
    width: screenWidth * 0.8,
    alignItems: 'center',
    gap: 5,
    borderColor: 'grey',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalOption: {
    padding: 15,
  },
  modalText: {
    fontFamily: 'Dosis-Medium',
    fontSize: 18,
    textAlign: 'center',
  },
});
