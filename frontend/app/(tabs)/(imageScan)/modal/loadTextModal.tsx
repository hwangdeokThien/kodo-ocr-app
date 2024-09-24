import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

interface LoadTextModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (
    title: string,
    content: string,
    createdDate: Date,
    modifiedDate: Date
  ) => void;
  content: string;
}

const LoadTextModal: React.FC<LoadTextModalProps> = ({
  isVisible,
  onClose,
  onSave,
  content,
}) => {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState(content);
  const [charCount, setCharCount] = useState(content.length);

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
    if (!noteTitle) {
      onClose();
      return;
    }
    onSave(noteTitle, noteContent, new Date(), new Date());
    onClose();
  };
  useEffect(() => {
    setNoteTitle("Scanned Text");
    setNoteContent(content);
  }, [isVisible]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
      style={styles.modalContainer}
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
                <Ionicons name="close-outline" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveNote}
                style={styles.backArrow}
              >
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

export default LoadTextModal;
