import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { DatePickerInput } from "react-native-paper-dates";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

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

  const handleSave = () => {
    onSave(name, birthDate.toISOString(), email, location);
    onClose();
  };

  return (
    <Modal transparent={true} visible={isVisible} style={{ margin: 0 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.modalContent}>
          <View style={{ height: 70 }} />

          <View style={{ marginHorizontal: 10 }}>
            <Text style={{ marginTop: 30, color: "black", fontSize: 20 }}>
              Full name
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "black",
                color: "black",
                fontSize: 20,
              }}
              placeholder="Enter your full name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={{ marginTop: 30, color: "black", fontSize: 20 }}>
              Email
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "black",
                color: "black",
                fontSize: 20,
              }}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => setEmail(text)}
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
                style={{ width: 300, fontSize: 20 }}
                mode="outlined"
              />
            </View>
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={{ marginTop: 30, color: "black", fontSize: 20 }}>
              Location
            </Text>
            <TextInput
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "black",
                color: "black",
                fontSize: 20,
              }}
              placeholder="Enter your location"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
      <View style={styles.bottomView}>
        <TouchableOpacity onPress={handleSave}>
          <View
            style={{
              borderRadius: 30,
              backgroundColor: "#1664b1",
              paddingHorizontal: 150,
              paddingVertical: 6,
              elevation: 5,
            }}
          >
            <Text style={styles.bottomText}>Save</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.topView}>
        <View style={{ margin: 20, flexDirection: "row" }}>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={{ marginTop: 3 }}
          >
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit profile</Text>
        </View>
      </View>
    </Modal>
  );
};

export default EditProfileModal;
const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: "black",
    marginLeft: 30,
    fontWeight: "bold",
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
});
