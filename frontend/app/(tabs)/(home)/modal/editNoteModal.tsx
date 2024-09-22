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
    createdDate: Date,
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
  const [botModalVisible, setBotModalVisible] = useState(false);
  const [botOption, setBotOption] = useState<string | null>(null);
  const [formFields, setFormFields] = useState<any>({});
  const AI_URL = process.env.EXPO_PUBLIC_AI_BASE_URL;

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
    onSave(note.id, noteTitle, noteContent, note.createdDate, new Date());
    onClose();
  };

  const handleBotOptionSelect = (option: string) => {
    setBotOption(option);
    setBotModalVisible(false);
    setFormFields({});
  };

  const handleFormFieldChange = (field: string, value: string) => {
    setFormFields((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderBotForm = () => {
    const handleApiCall = async () => {
      formFields.prompt_type = botOption;
      const formData = new FormData();
      for (const key in formFields) {
        formData.append(key, formFields[key]);
      }

      try {
        const response = await fetch(`${AI_URL}/ai_gen`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const resultText = await response.text();
          console.log("API Response (HTML/Text):", resultText);

          setNoteContent(noteContent + "\n\nGenerated:\n" + resultText);
          setFormFields({});
          setBotOption(null);
        } else {
          const errorText = await response.text();
          console.log("API Error (Text/HTML):", errorText);
        }
      } catch (error) {
        console.error("API call failed:", error);
      }
    };

    return (
      <View>
        {botOption === "note_template" && (
          <View>
            <TextInput
              placeholder="Note Type"
              value={formFields.note_type || ""}
              onChangeText={(text) => handleFormFieldChange("note_type", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Key Elements"
              value={formFields.key_elements || ""}
              onChangeText={(text) =>
                handleFormFieldChange("key_elements", text)
              }
              style={styles.input}
            />
          </View>
        )}

        {botOption === "idea_generator" && (
          <TextInput
            placeholder="Project Descriptions"
            value={formFields.project_description || ""}
            onChangeText={(text) =>
              handleFormFieldChange("project_description", text)
            }
            style={styles.input}
          />
        )}

        {botOption === "content_creator" && (
          <View>
            <TextInput
              placeholder="Topic"
              value={formFields.topic || ""}
              onChangeText={(text) => handleFormFieldChange("topic", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Tone"
              value={formFields.tone || ""}
              onChangeText={(text) => handleFormFieldChange("tone", text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Points"
              value={formFields.points || ""}
              onChangeText={(text) => handleFormFieldChange("points", text)}
              style={styles.input}
            />
          </View>
        )}

        <TouchableOpacity onPress={handleApiCall} style={styles.sendChatButton}>
          <Text style={styles.sendChatButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    );
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

              <TouchableOpacity
                onPress={() => setBotModalVisible(true)}
                style={styles.botButton}
              >
                <Ionicons name="chatbubble-outline" size={28} color="black" />
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

            {/* Render bot form if an option is selected */}
            {botOption && renderBotForm()}

            {/* Bot Options Modal */}
            <Modal
              transparent={true}
              visible={botModalVisible}
              animationType="slide"
              onRequestClose={() => setBotModalVisible(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.botOptionsContainer}>
                  <Text style={styles.modalTitle}>Select Actions</Text>
                  <TouchableOpacity
                    onPress={() => handleBotOptionSelect("note_template")}
                    style={styles.botOptionButton}
                  >
                    <Text style={styles.botOptionText}>
                      Generate Note Template
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleBotOptionSelect("idea_generator")}
                    style={styles.botOptionButton}
                  >
                    <Text style={styles.botOptionText}>
                      Create/Extend Ideas
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleBotOptionSelect("content_creator")}
                    style={styles.botOptionButton}
                  >
                    <Text style={styles.botOptionText}>Creating Contents</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  botOptionsContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    width: 300,
  },
  botButton: {
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#006769",
    fontFamily: "Dosis-ExtraBold",
  },
  botOptionButton: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "#EADBC8",
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },
  botOptionText: {
    color: "black",
    textAlign: "center",
    fontFamily: "Dosis-Bold",
    fontSize: 16,
  },
  input: {
    fontSize: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 10,
    width: "100%",
    fontFamily: "Dosis-Regular",
  },
  sendChatButton: {
    marginTop: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: "#40A578",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "transparent",
    width: "40%",
    alignSelf: "center",
  },
  sendChatButtonText: {
    color: "#40A578",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Dosis-Bold",
  },
});

export default EditNoteModal;
