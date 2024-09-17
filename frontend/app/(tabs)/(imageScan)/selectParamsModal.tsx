import React, { useState } from "react";
import { Modal, View, Text, Button } from "react-native";

interface SelectParamsModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: (
      reqStruct: string,
      llm_aided: string,
    ) => void;
}

const SelectParamsModal: React.FC<SelectParamsModalProps> = ({ isVisible, onClose, onConfirm }) => {
  const [reqStruct, setReqStruct] = useState("False");
  const [llmAided, setLlmAided] = useState("True");

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}>
          <Text>Select Options:</Text>

          {/* Select for req_struct */}
          <Text>req_struct</Text>
          <Button title="True" onPress={() => setReqStruct("True")} />
          <Button title="False" onPress={() => setReqStruct("False")} />

          {/* Select for llm_aided */}
          <Text>llm_aided</Text>
          <Button title="True" onPress={() => setLlmAided("True")} />
          <Button title="False" onPress={() => setLlmAided("False")} />

          <Button
            title="Confirm"
            onPress={() => {
              onConfirm(reqStruct, llmAided);
              onClose();
            }}
          />
          <Button title="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default SelectParamsModal;