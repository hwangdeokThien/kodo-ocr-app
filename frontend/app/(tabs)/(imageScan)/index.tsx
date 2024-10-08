import {
  CameraView,
  useCameraPermissions,
  CameraCapturedPicture,
} from "expo-camera";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useState, useRef, useCallback } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPalette,
  faBars,
  faArrowUpFromBracket,
  faCameraRetro,
  faCameraRotate,
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useDispatch } from "react-redux";
import { pushNote, setNotes } from "@/redux/noteReducer";
import LoadTextModal from "./modal/loadTextModal";
import * as SQLite from "expo-sqlite/legacy";
import LoadingModal from "@/components/LoadingModal";
import SelectParamsModal from "./modal/selectParamsModal";
import { useFocusEffect } from "expo-router";

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function ImageScan() {
  const [focused, setFocused] = useState(false);
  const [facing, setFacing] = useState(CameraType.back);
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadTextModalVisible, setLoadTextModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanContent, setScanContent] = useState("");
  const cameraRef = useRef<CameraView>(null);
  const [paramsModalVisible, setParamsModalVisible] = useState(false);
  const [selectedParams, setSelectedParams] = useState({
    req_struct: "False",
    llm_aided: "True",
  });
  const dispatch = useDispatch();

  const URL =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_URL_IOS
      : process.env.EXPO_PUBLIC_URL_ANDROID;

  const db = SQLite.openDatabase("notes.db");

  const permissionAlert = () =>
    Alert.alert(
      "Cannot access camera!",
      "Please grant permission before taking photo.",
      [
        {
          text: "OK",
          onPress: () => console.log("OK Pressed"),
          style: "cancel",
        },
      ]
    );

  useFocusEffect(
    useCallback(() => {
      setFocused(true);

      return () => {
        setFocused(false);
      };
    }, [])
  );

  if (!permission) {
    console.log("Permission not granted or not focused!");
    return <View />;
  }

  const checkPermission = () => {
    if (!permission?.granted) {
      permissionAlert();
      return false;
    }
    return true;
  };

  const handlePalletteClick = () => {};

  const toggleCameraFacing = () => {
    setFacing((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const handleTakePhoto = async () => {
    const havePermission = checkPermission();
    if (havePermission) {
      if (cameraRef.current) {
        const options = { quality: 1 };
        try {
          const picture: CameraCapturedPicture | undefined =
            await cameraRef.current.takePictureAsync(options);

          if (picture) {
            setImage(picture);
          } else {
            console.log("Photo taken unsuccessfully!");
          }
        } catch (error) {
          console.error("Error taking picture:", error);
        }
      }
    }
  };

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setImage(image);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleConfirmParams = (reqStruct: string, llmAided: string) => {
    setSelectedParams({
      req_struct: reqStruct,
      llm_aided: llmAided,
    });
    handleVerifyImage();
  };

  const handleVerifyImage = async () => {
    setIsLoading(true);
    try {
      const uploadResponse = await FileSystem.uploadAsync(
        `${URL}/api/photos/scan`,
        image.uri,
        {
          fieldName: "photo",
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          mimeType: image.mimeType,
          parameters: selectedParams,
        }
      );

      let finalOutput = "";
      if (selectedParams.llm_aided === "True") {
        const sections = uploadResponse.body.split(
          "====================================================================="
        );
        finalOutput = sections[3].trim();
      } else if (selectedParams.req_struct === "False") {
        const parsedResponse = JSON.parse(uploadResponse.body);
        finalOutput = parsedResponse.join("\n");
      }

      setScanContent(finalOutput);
      setLoadTextModalVisible(true);

      if (uploadResponse.status === 200) {
        console.log("Scan success!");
      } else {
        console.error("Scan failed!");
      }
    } catch (error) {
      console.error("Error during scan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveNoteToCloud = async (
    id: number | undefined,
    title: string,
    content: string,
    createdDate: Date,
    modifiedDate: Date
  ) => {
    try {
      const formData = new FormData();
      formData.append("id", id?.toString() || "");
      formData.append("title", title);
      formData.append("content", content);
      formData.append("createdDate", createdDate.toISOString());
      formData.append("modifiedDate", modifiedDate.toISOString());

      const response = await fetch(`${URL}/api/notes`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Note saved successfully:", response);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleSaveNote = (
    title: string,
    content: string,
    createdDate: Date,
    modifiedDate: Date
  ) => {
    console.log("Saving note:", title, content, createdDate, modifiedDate);
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO notes (title, content, createdDate, modifiedDate) VALUES (?, ?, ?, ?)",
        [title, content, createdDate.toISOString(), modifiedDate.toISOString()],
        (_, { insertId }) => {
          console.log("Note inserted with ID:", insertId);

          dispatch(
            pushNote({
              id: insertId,
              title,
              content,
              createdDate,
              modifiedDate,
            })
          );
          console.log("Saved note to local storage!");

          handleRemoveImage();
          saveNoteToCloud(insertId, title, content, createdDate, modifiedDate);
        },
        (tx, error) => {
          console.log("Error inserting note:", error);
          return true;
        }
      );
    });
  };

  return (
    <>
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 0, backgroundColor: "#FEFDED" }}
      />
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          backgroundColor: "#EADBC8",
          position: "relative",
        }}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appName}>Kodo</Text>
          </View>

          <View style={styles.topRightContainer}>
            <TouchableOpacity
              style={styles.topBarButtons}
              onPress={handlePalletteClick}
            >
              <FontAwesomeIcon
                icon={faArrowUpFromBracket}
                size={22}
                color="#006769"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topBarButtons}
              onPress={handlePalletteClick}
            >
              <FontAwesomeIcon icon={faPalette} size={22} color="#006769" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.topBarButtons}
              onPress={handlePalletteClick}
            >
              <FontAwesomeIcon icon={faBars} size={22} color="#006769" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.topButtonsContainer}>
          <TouchableOpacity
            style={styles.newImageButton}
            onPress={handleAddImage}
          >
            <Text style={styles.buttonImageText}>Add Image</Text>
            <Ionicons name="image-outline" style={styles.imageIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.newImageButton}
            onPress={handleTakePhoto}
          >
            <Text style={styles.buttonImageText}>Take Photo</Text>
            <Ionicons name="aperture-outline" style={styles.imageIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.cameraContainer}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.imageShow} />
          ) : permission.granted && focused ? (
            <View style={styles.container}>
              <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
              />
            </View>
          ) : (
            <View style={styles.noCameraContainer}>
              <FontAwesomeIcon
                icon={faCameraRetro}
                size={screenWidth * 0.4}
                color="grey"
              />
              <Text style={styles.permissionText}>
                We need your permission to show the camera
              </Text>
              <TouchableOpacity onPress={requestPermission}>
                <Text style={styles.grantText}>Grant Permission</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.bottomButtonsContainer}>
          <TouchableOpacity
            style={{
              shadowColor: "#40A578",
              shadowOpacity: 0.1,
              marginLeft: 15,
            }}
            onPress={handleRemoveImage}
          >
            <FontAwesomeIcon icon={faCircleXmark} size={35} color="#40A578" />
          </TouchableOpacity>

          {image ? (
            <TouchableOpacity
              style={{
                shadowColor: "#40A578",
                shadowOpacity: 0.1,
              }}
              onPress={() => setParamsModalVisible(true)}
            >
              <FontAwesomeIcon icon={faCircleCheck} size={70} color="#40A578" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                shadowColor: "#40A578",
                shadowOpacity: 0.1,
              }}
              onPress={handleTakePhoto}
            >
              <FontAwesomeIcon icon={faCircle} size={70} color="#40A578" />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={{
              shadowColor: "#40A578",
              shadowOpacity: 0.1,
              marginRight: 15,
            }}
            onPress={toggleCameraFacing}
          >
            <FontAwesomeIcon icon={faCameraRotate} size={35} color="#40A578" />
          </TouchableOpacity>
        </View>

        <SelectParamsModal
          isVisible={paramsModalVisible}
          onClose={() => setParamsModalVisible(false)}
          onConfirm={handleConfirmParams}
        />

        <LoadTextModal
          isVisible={loadTextModalVisible}
          onClose={() => setLoadTextModalVisible(false)}
          onSave={handleSaveNote}
          content={scanContent}
        />

        <LoadingModal isVisible={isLoading} />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  imageShow: {
    flex: 1,
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  newImageButton: {
    backgroundColor: "#40A578",
    padding: 10,
    margin: 10,
    borderRadius: 20,
    shadowColor: "black",
    shadowOpacity: 0.2,
    elevation: 6,
    flexDirection: "row",
    justifyContent: "center",
  },
  topBar: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
    backgroundColor: "#FEFDED",
    borderBottomColor: "#FEFDED",
    borderBottomWidth: 6,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  topRightContainer: {
    flexDirection: "row",
  },
  topBarButtons: {
    backgroundColor: "transparent",
    marginVertical: 2,
    marginHorizontal: 8,
  },
  buttonImageText: {
    fontFamily: "Dosis-ExtraBold",
    fontSize: 20,
    color: "white",
  },
  text: {
    fontFamily: "Dosis-Regular",
    fontSize: 20,
    color: "white",
  },
  imageIcon: {
    marginTop: 1,
    marginLeft: 2,
    fontSize: 26,
    color: "white",
  },
  appName: {
    fontFamily: "Dosis-ExtraBold",
    fontSize: 35,
    marginLeft: 8,
    color: "#006769",
  },
  cameraContainer: {
    alignSelf: "center",
    justifyContent: "center",
    marginVertical: 20,
    width: screenWidth * 0.85,
    height: screenHeight * 0.5,
    borderColor: "grey",
    borderWidth: 3,
    borderRadius: 3,
    shadowColor: "grey",
    shadowOpacity: 0.1,
  },
  noCameraContainer: {
    alignItems: "center",
    flexDirection: "column",
  },
  permissionText: {
    marginTop: 30,
    fontFamily: "Dosis-Regular",
    fontSize: 15,
    color: "grey",
  },
  grantText: {
    margin: 2,
    fontFamily: "Dosis-Bold",
    fontSize: 20,
    color: "#006769",
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingVertical: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
