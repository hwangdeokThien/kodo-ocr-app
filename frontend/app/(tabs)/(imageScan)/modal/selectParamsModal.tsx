import React, { useState } from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface SelectParamsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (reqStruct: string, llm_aided: string) => void;
}

const SelectParamsModal: React.FC<SelectParamsModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
}) => {
  const [reqStruct, setReqStruct] = useState<string>("False");
  const [llmAided, setLlmAided] = useState<string>("True");

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Options</Text>

          <Text style={styles.label}>Organize Scanned Text</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={reqStruct}
              onValueChange={(itemValue: string) => setReqStruct(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
              selectionColor={"#40A578"}
            >
              <Picker.Item label="Yes" value="True" />
              <Picker.Item label="No" value="False" />
            </Picker>
          </View>

          <Text style={styles.label}>AI Support</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={llmAided}
              onValueChange={(itemValue: string) => setLlmAided(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Yes" value="True" />
              <Picker.Item label="No" value="False" />
            </Picker>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Confirm"
              onPress={() => {
                onConfirm(reqStruct, llmAided);
                onClose();
              }}
              color="#40A578"
            />
            <Button title="Cancel" onPress={onClose} color="#ff6347" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SelectParamsModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#FEFDED",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#006769",
    fontFamily: "Dosis-ExtraBold",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
    marginTop: 40,
    fontFamily: "Dosis-Medium",
  },
  pickerContainer: {
    width: "100%",
    borderRadius: 10,
    backgroundColor: "transparent",
    marginTop: 20,
    marginBottom: 15,
    padding: 5,
  },
  picker: {
    height: 50,
    color: "#006769",
  },
  pickerItem: {
    marginTop: -83,
    fontSize: 16,
    fontFamily: "Dosis-Medium",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    width: "100%",
    marginTop: 24,
  },
});
