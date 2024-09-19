import React, { useState, useCallback, useEffect } from "react";
import { Modal, View, StyleSheet, TextInput, TouchableOpacity, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

interface Message {
  role: 'human' | 'ai';
  content: string;
}

interface ChatBotModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ChatBotModal: React.FC<ChatBotModalProps> = ({
  isVisible,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const API_URL = "https://your-api-url.com/api/chat";

  useEffect(() => {
    const initialMessages: Message[] = [
      {role: 'human', content:'hello, my name is Thien.'},
      { role: 'ai', content: "Hello! How can I help you today?" },
    ];
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add the human message to the conversation
    const newMessages: Message[] = [
      ...messages,
      { role: 'human', content: inputText }
    ];
    setMessages(newMessages);
    setInputText("");

    try {
      // Send the message to the API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();
      const aiResponse: Message = { role: 'ai', content: data.content };

      // Update the conversation with the AI's response
      setMessages((prevMessages) => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isHuman = item.role === 'human';
    return (
      <View style={[styles.messageBubble, isHuman ? styles.humanBubble : styles.aiBubble]}>
        <Text style={isHuman ? styles.humanText : styles.aiText}>{item.content}</Text>
      </View>
    );
  };

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
            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
              <TouchableOpacity onPress={onClose} style={styles.backArrow}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.messageList}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
            <View style={styles.inputContainer}>
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                style={styles.input}
                placeholder="Type your message..."
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Ionicons name="send" size={24} color="#006769" />
              </TouchableOpacity>
            </View>
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
  messageList: {
    flex: 1,
  },
  backArrow: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  humanBubble: {
    backgroundColor: "#006769",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#EADBC8",
    alignSelf: "flex-start",
  },
  aiText: {
    color: "black",
    fontSize: 16,
    fontFamily: 'Dosis-Regular'
  },
  humanText: {
    color: "white",
    fontSize: 16,
    fontFamily: 'Dosis-Regular'
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    borderTopWidth: 1,
    marginBottom: -10,
    borderTopColor: "#EADBC8",
  },
  input: {
    flex: 1,
    paddingLeft: 15,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    marginRight: 10,
    fontFamily: 'Dosis-Medium',
  },
  sendButton: {
    padding: 10,
    backgroundColor: "transparent",
  },
});

export default ChatBotModal;
