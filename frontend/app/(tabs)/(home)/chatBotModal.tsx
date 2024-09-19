import React, { useState, useEffect, useRef } from "react";
import { Modal, View, StyleSheet, TextInput, TouchableOpacity, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export interface Message {
  role: 'User' | 'Chatbot';
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
  const flatListRef = useRef<FlatList | null>(null);
  const AI_URL = process.env.EXPO_PUBLIC_AI_BASE_URL;

  useEffect(() => {
    const fetchMessageHistory = async () => {
      try {
        const formData = new FormData();
        formData.append('prompt_type', 'general_assistant');
  
        const response = await fetch(`${AI_URL}/chat_history`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();

        const parsedMessages = data.map((message: string) => {
          const [role, content] = message.split(': ');
          return { role, content };
        });
  
        setMessages(parsedMessages);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchMessageHistory();
  }, []);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'User', content: inputText }
    ];
    setMessages(newMessages);
    setInputText("");

    try {
      const formData = new FormData();
      formData.append('prompt_type', 'general_assistant');
      formData.append('message', inputText);

      const response = await fetch(`${AI_URL}/ai_gen`, {
        method: 'POST',
        body: formData
      });
      const receivedMessage = await response.text();
      const aiResponse: Message = { role: 'Chatbot', content: receivedMessage };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isHuman = item.role === 'User';
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
            <View style={{ justifyContent: "space-between", flexDirection: "row", paddingBottom: 15 }}>
              <TouchableOpacity onPress={onClose} style={styles.backArrow}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.messageList}
              contentContainerStyle={{ paddingBottom: 20 }}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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
    alignSelf: "center",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
  },
  humanBubble: {
    marginRight: 6,
    backgroundColor: "#006769",
    alignSelf: "flex-end",
  },
  aiBubble: {
    marginLeft: 6,
    backgroundColor: "#EADBC8",
    alignSelf: "flex-start",
  },
  aiText: {
    color: "black",
    fontSize: 16,
    fontFamily: 'Dosis-Regular',
  },
  humanText: {
    color: "white",
    fontSize: 16,
    fontFamily: 'Dosis-Regular',
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
