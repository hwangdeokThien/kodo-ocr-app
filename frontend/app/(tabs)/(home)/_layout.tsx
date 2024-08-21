import {
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Note from "@/components/Note";
import { Ionicons } from "@expo/vector-icons";
import { loadFonts } from "@/components/Fonts";
import { NoteProps } from "@/components/Note";

const screenWidth = Dimensions.get("screen").width;
export default function HomeScreen() {
  const fontsLoaded = loadFonts();
  const [notesData, setNotesData] = useState<NoteProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<NoteProps[]>([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const URL =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_URL_IOS
      : process.env.EXPO_PUBLIC_URL_ANDROID;

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(URL);
        const response = await fetch(`${URL}/api/notes/`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching notes data: ${response.status}`);
        }

        const data = await response.json();
        setNotesData(data);
        setFilteredNotes(data);
        // console.log(data);
      } catch (err) {
        console.log(`Error fetching note data: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filtered = notesData.filter(
        (note) =>
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notesData);
    }
  };

  const handleSort = (order: string) => {
    setSortOrder(order);
    setSortModalVisible(false);

    const sortedNotes = [...filteredNotes].sort((a, b) => {
      const dateA = new Date(a.accessedDate).getTime();
      const dateB = new Date(b.accessedDate).getTime();
      return order === "oldest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotes(sortedNotes);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#FEFDED", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/app-background.png")}
          style={{}}
        />
      }
      headerHeight={100}
    >
      <Text style={styles.homeText}> Your Note</Text>

      <View style={styles.searchAndFilter}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search-outline"
            style={{ fontSize: 20, color: "grey" }}
          />
          <TextInput
            placeholder="Search notes..."
            value={searchQuery}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity onPress={() => setSortModalVisible(true)}>
          <Ionicons name="filter" style={{ fontSize: 25, color: "grey" }} />
        </TouchableOpacity>
      </View>

      <View style={styles.homeBody}>
        {filteredNotes.map((note, index) => (
          <Note
            key={index}
            title={note.title}
            content={note.content}
            accessedDate={note.accessedDate}
          />
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
            <TouchableOpacity
              onPress={() => handleSort("newest")}
              style={styles.modalOption}
            >
              <Text style={styles.modalText}>Newest First</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSort("oldest")}
              style={styles.modalOption}
            >
              <Text style={styles.modalText}>Oldest First</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSortModalVisible(false)}
              style={styles.modalOption}
            >
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
    flexDirection: "row",
    alignItems: "center",
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
    position: "absolute",
  },
  homeText: {
    color: "#4F6F52",
    fontFamily: "Dosis-ExtraBold",
    fontSize: 40,
    shadowColor: "#4F6F52",
    shadowOpacity: 0.12,
  },
  homeBody: {
    marginTop: 10,
    gap: 15,
  },
  searchAndFilter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchBox: {
    flexDirection: "row",
    height: 40,
    width: screenWidth * 0.8,
    alignItems: "center",
    gap: 5,
    borderColor: "grey",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalOption: {
    padding: 15,
  },
  modalText: {
    fontFamily: "Dosis-Medium",
    fontSize: 18,
    textAlign: "center",
  },
});
