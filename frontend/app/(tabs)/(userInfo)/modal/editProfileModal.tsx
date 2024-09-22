import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  DatePickerInput,
  en,
  registerTranslation,
} from "react-native-paper-dates";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
registerTranslation("en", en);

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (
    username: string,
    dateOfBirth: string,
    email: string,
    location: string
  ) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());

  const insets = useSafeAreaInsets();

  const handleSave = () => {
    onSave(name, birthDate.toISOString(), email, location);
    onClose();
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
        <SafeAreaView style={[styles.modalContent, { paddingTop: insets.top }]}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.innerContent}>
              <View style={{ height: 70 }} />
              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    marginTop: 30,
                    color: "black",
                    fontSize: 20,
                    fontFamily: "Dosis-Bold",
                  }}
                >
                  Full name
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    marginTop: 30,
                    color: "black",
                    fontSize: 20,
                    fontFamily: "Dosis-Bold",
                  }}
                >
                  Email
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                />
              </View>

              <View style={{ marginHorizontal: 10 }}>
                <Text
                  style={{
                    marginTop: 30,
                    color: "black",
                    fontSize: 20,
                    fontFamily: "Dosis-Bold",
                  }}
                >
                  Location
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your location"
                  value={location}
                  onChangeText={(text) => setLocation(text)}
                />
              </View>

              <View style={{ marginHorizontal: 10, marginTop: 30 }}>
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <DatePickerInput
                    locale="en"
                    label="Birthday"
                    value={birthDate}
                    onChange={(date: Date | undefined) =>
                      setBirthDate(date || new Date())
                    }
                    inputMode="start"
                    style={{ width: 300 }}
                    contentStyle={{
                      fontSize: 20,
                      fontFamily: "Dosis-Medium",
                    }}
                    mode="outlined"
                  />
                </View>
              </View>

              <View style={{ height: 100 }} />
            </View>
          </ScrollView>
          <View style={[styles.topView, { paddingTop: insets.top }]}>
            <View
              style={{
                margin: 20,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => onClose()}
                style={styles.backArrow}
              >
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.backArrow}>
                <Ionicons name="checkmark" size={28} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
};

export default EditProfileModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    flex: 1,
  },
  innerContent: {
    marginHorizontal: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "black",
    color: "black",
    fontSize: 20,
    fontFamily: "Dosis-Regular",
  },
  title: {
    fontSize: 24,
    color: "black",
    marginLeft: 30,
    fontWeight: "bold",
  },
  backArrow: {
    alignSelf: "flex-start",
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderTopColor: "#ccc",
    borderTopWidth: 1,
    backgroundColor: "white",
  },
  bottomText: {
    color: "white",
    fontSize: 18,
  },
  topView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
  },
  saveButton: {
    borderRadius: 30,
    backgroundColor: "#1664b1",
    paddingHorizontal: 150,
    paddingVertical: 6,
    elevation: 5,
  },
});
