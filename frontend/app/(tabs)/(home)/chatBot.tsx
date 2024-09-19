import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat, Bubble, InputToolbar, IMessage } from "react-native-gifted-chat";
import { View, StyleSheet } from "react-native";

// Define the types for messages
interface User {
  _id: string | number;
  name: string;
  avatar?: string;
}

interface ChatMessage extends IMessage {
  user: User;
}

// Main chat component
const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Initial bot message
    setMessages([
      {
        _id: 1,
        text: "Hello! How can I help you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "ChatBot",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages as ChatMessage[])
    );

    // Simulate bot response
    setTimeout(() => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [
          {
            _id: Math.random().toString(),
            text: "This is an automated response.",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "ChatBot",
            },
          },
        ] as ChatMessage[])
      );
    }, 1000);
  }, []);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#006769",
          },
          left: {
            backgroundColor: "#EADBC8",
          },
        }}
        textStyle={{
          right: {
            color: "white",
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={styles.inputToolbar}
      primaryStyle={{ alignItems: "center" }}
    />
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        placeholder="Type your message..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  inputToolbar: {
    borderTopWidth: 1,
    borderTopColor: "#EADBC8",
  },
});

export default ChatBot;
