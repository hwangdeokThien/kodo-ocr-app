import {
    CameraView,
    useCameraPermissions,
    CameraCapturedPicture,
} from "expo-camera";
import { CameraType } from "expo-camera/build/legacy/Camera.types";
import { useState, useRef } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
    Alert,
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
import * as FileSystem from 'expo-file-system';

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

export default function ImageScan() {
    const [facing, setFacing] = useState(CameraType.back);
    const [image, setImage] = useState<any>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

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

    if (!permission) {
        return <View/>;
    }

    const checkPermission = () => {
        if (!permission?.granted) {
            permissionAlert();
            return false;
        }
        return true;
    };

    const handlePalletteClick = () => {};

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
                        console.log('Photo taken unsuccessfully!')
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
            allowsEditing: true,
            aspect: [screenWidth * 0.85, screenHeight * 0.5],
            quality: 1
        });

        if (!result.canceled) {
            const image = result.assets[0];
            setImage(image);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const handleVerifyImage = async () => {    
        try {
            const uploadResponse = await FileSystem.uploadAsync("http://localhost:3009/api/notes/scan", image.uri, {
                fieldName: 'photo',
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                mimeType: image.mimeType
            });

            // console.log(uploadResponse)

            if (uploadResponse.status === 200) {
                console.log('Upload success!');
            } else {
                console.error('Upload failed!')
            }        
        } catch (error) {
            console.error("Error during upload:", error);
        }
    };
    

    const toggleCameraFacing = () => {
        setFacing((current) =>
            current === CameraType.back ? CameraType.front : CameraType.back
        );
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
                            <FontAwesomeIcon
                                icon={faPalette}
                                size={22}
                                color="#006769"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.topBarButtons}
                            onPress={handlePalletteClick}
                        >
                            <FontAwesomeIcon
                                icon={faBars}
                                size={22}
                                color="#006769"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.topButtonsContainer}>
                    <TouchableOpacity
                        style={styles.newImageButton}
                        onPress={handleAddImage}
                    >
                        <Text style={styles.buttonImageText}>Add Image</Text>
                        <Ionicons
                            name="image-outline"
                            style={styles.imageIcon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.newImageButton}
                        onPress={handleTakePhoto}
                    >
                        <Text style={styles.buttonImageText}>Take Photo</Text>
                        <Ionicons
                            name="aperture-outline"
                            style={styles.imageIcon}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.cameraContainer}>
                    {image ? (
                        <Image
                            source={{ uri: image.uri }}
                            style={styles.imageShow}
                        />
                    ) : permission.granted ? (
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
                                <Text style={styles.grantText}>
                                    Grant Permission
                                </Text>
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
                        <FontAwesomeIcon
                            icon={faCircleXmark}
                            size={35}
                            color="#40A578"
                        />
                    </TouchableOpacity>

                    {image ? (
                        <TouchableOpacity
                            style={{
                                shadowColor: "#40A578",
                                shadowOpacity: 0.1,
                            }}
                            onPress={handleVerifyImage}
                        >
                            <FontAwesomeIcon
                                icon={faCircleCheck}
                                size={70}
                                color="#40A578"
                            />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={{
                                shadowColor: "#40A578",
                                shadowOpacity: 0.1,
                            }}
                            onPress={handleTakePhoto}
                        >
                            <FontAwesomeIcon
                                icon={faCircle}
                                size={70}
                                color="#40A578"
                            />
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
                        <FontAwesomeIcon
                            icon={faCameraRotate}
                            size={35}
                            color="#40A578"
                        />
                    </TouchableOpacity>
                </View>
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
