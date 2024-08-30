import { NoteProps } from "@/components/Note";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface EditNoteModalProps {
  isVisible: boolean;
  note: NoteProps;
  onClose: () => void;
  onSave: (
    id: number | undefined,
    title: string,
    content: string,
    modifiedDate: Date
  ) => void;
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({
  isVisible,
  note,
  onClose,
  onSave,
}) => {
  const [noteTitle, setNoteTitle] = useState(note.title);
  const [noteContent, setNoteContent] = useState(note.content);
  const [charCount, setCharCount] = useState(note.content.length);

  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateTime = `${date} ${time}`;

  const handleNoteContentChange = (text: string) => {
    setNoteContent(text);
    setCharCount(text.length);
  };

  const handleSaveNote = () => {
    // Logic to save the note
    onSave(note.id, noteTitle, noteContent, new Date());
    onClose();
  };
  useEffect(() => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setCharCount(note.content.length);
  }, [isVisible]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <SafeAreaProvider>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <TouchableOpacity
              onPress={() => onClose()}
              style={styles.backArrow}
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSaveNote} style={styles.backArrow}>
              <Ionicons name="checkmark" size={28} color="black" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.inputTitle}
            placeholder="Title"
            value={noteTitle}
            onChangeText={setNoteTitle}
            multiline
          />
          <Text style={styles.creationDate}>
            {dateTime} | {charCount}{" "}
            {charCount > 2 ? "characters" : "character"}
          </Text>
          <TextInput
            style={styles.inputContent}
            placeholder="Start typing here..."
            value={noteContent}
            onChangeText={handleNoteContentChange}
            multiline
          />
        </View>
      </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  backArrow: {
    alignSelf: "flex-start",
  },
  backArrowText: {
    fontSize: 24,
    fontFamily: "Dosis-Bold",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputTitle: {
    fontSize: 24,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontFamily: "Dosis-Bold",
  },
  inputContent: {
    fontSize: 16,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontFamily: "Dosis-Medium",
  },
  creationDate: {
    marginHorizontal: 10,
    marginBottom: 20,
    color: "#888",
    fontFamily: "Dosis-Medium",
  },
  saveButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default EditNoteModal;
