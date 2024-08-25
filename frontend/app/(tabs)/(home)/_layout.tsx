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
import AddNoteModal from "./noteModal";
import { useDispatch, useSelector } from "react-redux";
import * as SQLite from "expo-sqlite/legacy";
import { pushNote, setNotes } from "@/redux/noteReducer";
import { RootState } from "@/redux/store";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
export default function HomeScreen() {
  const fontsLoaded = loadFonts();
  const [notesData, setNotesData] = useState<NoteProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<NoteProps[]>([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [addNoteModalVisible, setAddNoteModalVisible] = useState(false);
  const notes = useSelector((state: RootState) => state.note.notes);

  const dispatch = useDispatch();

  const db = SQLite.openDatabase("notes.db");

  const handleSaveNote = (
    title: string,
    content: string,
    createdDate: Date,
    modifiedDate: Date
  ) => {
    console.log(createdDate, modifiedDate);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO notes (title, content, createdDate, modifiedDate) VALUES (?, ?, ?, ?)",
        [title, content, createdDate.toISOString(), modifiedDate.toISOString()],
        (_, { insertId }) => {
          console.log("Note inserted with ID:", insertId); // Log the insertId
          setNotesData([
            ...notesData,
            {
              id: insertId,
              title,
              content,
              createdDate,
              modifiedDate,
            },
          ]);
          setFilteredNotes([
            ...filteredNotes,
            {
              id: insertId,
              title,
              content,
              createdDate,
              modifiedDate,
            },
          ]);
        },
        (tx, error) => {
          console.log("Error inserting note:", error);
          return true;
        }
      );
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, createdDate DATE, modifiedDate DATE)"
          );
        });

        db.transaction((tx) => {
          tx.executeSql("SELECT * FROM notes", [], (_, { rows }) => {
            const data: NoteProps[] = [];
            for (let i = 0; i < rows.length; i++) {
              data.push(rows.item(i));
            }
            console.log(data);
            dispatch(setNotes(data));
            setNotesData(data);
            setFilteredNotes(data);
          });
        });
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
      const dateA = new Date(a.modifiedDate || a.createdDate).getTime();
      const dateB = new Date(b.modifiedDate || b.createdDate).getTime();
      return order === "oldest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotes(sortedNotes);
  };

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#FEFDED", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/app-background.png")}
            style={{}}
          />
        }
        headerHeight={screenHeight * 0.25}
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
              id={note.id}
              title={note.title}
              content={note.content}
              createdDate={note.createdDate}
              modifiedDate={note.modifiedDate}
            />
          ))}
        </View>
      </ParallaxScrollView>
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
      <AddNoteModal
        isVisible={addNoteModalVisible}
        onClose={() => setAddNoteModalVisible(false)}
        onSave={handleSaveNote}
      />
      <View>
        <TouchableOpacity
          style={styles.addNoteButton}
          onPress={() => {
            setAddNoteModalVisible(true);
          }}
        >
          <Ionicons
            name="add"
            style={{ color: "white", fontSize: 24, fontWeight: "bold" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  addNoteButton: {
    backgroundColor: "#66d772",
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    width: 50,
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 50,
  },
});
