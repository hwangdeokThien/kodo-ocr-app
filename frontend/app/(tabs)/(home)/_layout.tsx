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
import AddNoteModal from "./addNoteModal";
import { useDispatch, useSelector } from "react-redux";
import * as SQLite from "expo-sqlite/legacy";
import { pushNote, setNotes } from "@/redux/noteReducer";
import { RootState } from "@/redux/store";
import EditNoteModal from "./editNoteModal";
import { Menu } from "react-native-paper";
import axios from "axios";
import ChatBotModal from "./chatBotModal";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
export default function HomeScreen() {
  interface VisibleMenus {
    [key: number]: boolean;
  }
  const fontsLoaded = loadFonts();
  const [notesData, setNotesData] = useState<NoteProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState<NoteProps[]>([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [addNoteModalVisible, setAddNoteModalVisible] = useState(false);
  const [editNoteModalVisible, setEditNoteModalVisible] = useState(false);
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NoteProps | null>(null);
  const [visibleMenus, setVisibleMenus] = useState<VisibleMenus>({});
  
  const URL =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_URL_IOS
      : process.env.EXPO_PUBLIC_URL_ANDROID;
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const notes = useSelector((state: RootState) => state.note.notes);
  const dispatch = useDispatch();
  const db = SQLite.openDatabase("notes.db");

  const openMenu = (noteId: any) => {
    setVisibleMenus((prev) => ({ ...prev, [noteId]: true }));
  };

  const handleOnLongPress = (event: any, noteId: number | undefined) => {
    const anchorEvent = {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    };
    setAnchor(anchorEvent);
    openMenu(noteId);
  };

  const closeMenu = (noteId: any) => {
    setVisibleMenus((prev) => ({ ...prev, [noteId]: false }));
  };

  const handleSaveNote = (
    title: string,
    content: string,
    createdDate: Date,
    modifiedDate: Date
  ) => {
    console.log("Saving note:", title, content, createdDate, modifiedDate);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO notes (title, content, createdDate, modifiedDate) VALUES (?, ?, ?, ?)",
        [title, content, createdDate.toISOString(), modifiedDate.toISOString()],
        (_, { insertId }) => {
          console.log("Note inserted with ID:", insertId);
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
          console.log("Notes data:", notesData);
          saveNote(insertId, title, content, createdDate, modifiedDate);
        },
        (tx, error) => {
          console.log("Error inserting note:", error);
          return true;
        }
      );
    });
  };

  const handleUpdateNote = (
    id: number | undefined,
    title: string,
    content: string,
    modifiedDate: Date
  ) => {
    if (id === undefined) {
      console.error("ID is undefined. Cannot update note.");
      return;
    }
    if (!title) {
      console.error("Title cannot be empty. Cannot update note.");
      return;
    }
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE notes SET title = ?, content = ?, modifiedDate = ? WHERE id = ?",
        [title, content, modifiedDate.toISOString(), id],
        () => {
          console.log("Note updated with ID:", id); // Log the insertId
          const updatedNotes = notesData.map((note) => {
            if (note.id === id) {
              return {
                ...note,
                title,
                content,
                modifiedDate,
              };
            }
            return note;
          });
          setNotesData(updatedNotes);
          setFilteredNotes(updatedNotes);
        },
        (tx, error) => {
          console.log("Error updating note:", error);
          return true;
        }
      );
    });
    updateNote(id, title, content, modifiedDate);
  };

  const handleDeleteNote = (id: number | undefined) => {
    if (id === undefined) {
      console.error("ID is undefined. Cannot delete note.");
      return;
    }
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM notes WHERE id = ?",
        [id],
        () => {
          console.log("Note deleted with ID:", id);
          const updatedNotes = notesData.filter((note) => note.id !== id);
          setNotesData(updatedNotes);
          setFilteredNotes(updatedNotes);
        },
        (tx, error) => {
          console.log("Error deleting note:", error);
          return true;
        }
      );
    });
    deleteNote(id);
  };

  const saveNote = async (
    id: number | undefined,
    title: string,
    content: string,
    createdDate: Date,
    modifiedDate: Date
  ) => {
    try {
      const formData = new FormData();
      formData.append("id", id?.toString() || "");
      formData.append("title", title);
      formData.append("content", content);
      formData.append("createdDate", createdDate.toISOString());
      formData.append("modifiedDate", modifiedDate.toISOString());

      const response = await fetch(`${URL}/api/notes`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Note saved successfully:", response);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const deleteNote = async (id: number | undefined) => {
    if (id === undefined) return;

    try {
      await axios.delete(`${URL}/api/notes/${id}`);
      console.log("Note deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const updateNote = async (
    id: number | undefined,
    title: string,
    content: string,
    modifiedDate: Date
  ) => {
    if (id === undefined) return;

    try {
      const response = await axios.patch(`${URL}/api/notes/${id}`, {
        title,
        content,
        modifiedDate: modifiedDate.toISOString(),
      });

      const updatedNote = response;
      console.log("Note updated successfully:", updatedNote);
    } catch (error) {
      console.error("Error updating note:", error);
    }
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
      return order === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredNotes(sortedNotes);
  };

  const handleNotePress = (note: NoteProps) => {
    console.log("Note pressed:", note);
    setSelectedNote(note);
    setEditNoteModalVisible(true);
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
        <View
          style={{
            marginTop: -10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginHorizontal: -5,
          }}
        >
          <Text style={styles.homeText}> Your Note</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                setIsChatBotVisible(true);
              }}
            >
              <Ionicons
                name="chatbubble-outline"
                style={{ fontSize: 36, color: "#4F6F52"}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAddNoteModalVisible(true);
              }}
            >
              <Ionicons
                name="create-outline"
                style={{ fontSize: 36, color: "#4F6F52" , marginLeft: 10}}
              />
            </TouchableOpacity>
          </View>
          
        </View>

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
            <TouchableOpacity
              key={index}
              onPress={() => handleNotePress(note)}
              onLongPress={(event) => handleOnLongPress(event, note.id)}
            >
              <Menu
                visible={
                  note.id !== undefined ? visibleMenus[note.id] || false : false
                }
                onDismiss={() => closeMenu(note.id)}
                anchor={anchor}
              >
                <Menu.Item
                  onPress={() => handleDeleteNote(note.id)}
                  title="Delete"
                  leadingIcon="delete"
                />
              </Menu>
              <Note
                id={note.id}
                title={note.title}
                content={note.content}
                createdDate={note.createdDate}
                modifiedDate={note.modifiedDate}
              />
            </TouchableOpacity>
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
      <ChatBotModal
        isVisible={isChatBotVisible}
        onClose={() => setIsChatBotVisible(false)}
      />
      <AddNoteModal
        isVisible={addNoteModalVisible}
        onClose={() => setAddNoteModalVisible(false)}
        onSave={handleSaveNote}
      />

      {selectedNote ? (
        <EditNoteModal
          isVisible={editNoteModalVisible}
          note={selectedNote}
          onClose={() => setEditNoteModalVisible(false)}
          onSave={handleUpdateNote}
        />
      ) : null}
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
