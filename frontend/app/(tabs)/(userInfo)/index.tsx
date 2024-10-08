import React, { useState } from "react";
import { useEffect } from "react";
import {
  View,
  Dimensions,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native";
import { StyleSheet, Image } from "react-native";
import { loadFonts } from "@/components/Fonts";
import InfoItem from "@/components/UserInfoItem";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfileModal from "./modal/editProfileModal";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import * as FileSystem from "expo-file-system";

type UserInfoProps = {
  username: string;
  name: string;
  email: string;
  avatar?: string;
  dateOfBirth?: string;
  location?: string;
  createdAt?: Date;
};

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const staticData: UserInfoProps = {
  username: "Unknown",
  name: "Unknown",
  email: "Unknown",
  avatar: undefined,
  dateOfBirth: undefined,
  location: "Unknown",
  createdAt: undefined,
};

const AVATAR_STORAGE_KEY = "@user_avatar";
const USER_INFO_STORAGE_KEY = "@user_info";

export default function UserInfoScreen() {
  const fontsLoaded = loadFonts();
  const [userInfo, setUserInfo] = useState<UserInfoProps>(staticData);
  const [image, setImage] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  // Load user info and avatar from AsyncStorage on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem(
          USER_INFO_STORAGE_KEY
        );
        const storedAvatar = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);

        if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
        }

        if (storedAvatar) {
          setImage(storedAvatar);
        }
      } catch (err) {
        console.log(`Error loading user information: ${err}`);
      }
    };

    loadUserData();
  }, []);

  // Save profile information to AsyncStorage
  const handleSaveProfile = async (
    username: string,
    dateOfBirth: string,
    email: string,
    location: string
  ) => {
    const formattedDate = format(new Date(dateOfBirth), "MMMM dd, yyyy");
    const updatedUserInfo: UserInfoProps = {
      name: username,
      username,
      dateOfBirth: formattedDate,
      email,
      location,
    };
    setUserInfo(updatedUserInfo);

    try {
      await AsyncStorage.setItem(
        USER_INFO_STORAGE_KEY,
        JSON.stringify(updatedUserInfo)
      );
      console.log("User info saved to AsyncStorage");
    } catch (error) {
      console.log("Error saving user info", error);
    }
    setEditModalVisible(false);
  };

  // Edit the user's avatar and save to AsyncStorage
  const editImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);

      try {
        await AsyncStorage.setItem(AVATAR_STORAGE_KEY, selectedImage);
        console.log("Avatar saved to AsyncStorage");
      } catch (error) {
        console.log("Error saving avatar to AsyncStorage", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Image
            source={require("@/assets/images/user-background.png")}
            style={styles.headerImage}
          />
        }
        headerHeight={screenHeight * 0.25}
      >
        <View style={{ height: screenWidth * 0.15 }} />
        <View style={styles.content}>
          <Text style={styles.userName}>{userInfo.name}</Text>
          <TouchableOpacity
            style={styles.userInfoBox}
            onLongPress={() => setEditModalVisible(true)}
          >
            {Object.entries(userInfo)
              .filter(([field]) => !["name", "bio", "avatar"].includes(field))
              .map(([field, value]) => (
                <InfoItem key={field} field={field} value={value} />
              ))}
          </TouchableOpacity>
        </View>
        <View style={{ height: screenWidth * 0.15 }} />
      </ParallaxScrollView>
      <View
        style={{
          position: "absolute",
          top: 0.25 * screenHeight - 0.2 * screenWidth,
          width: "100%",
          alignItems: "center",
        }}
      >
        {image ? (
          <Image
            style={styles.avatarFrame}
            source={{ uri: image }}
            resizeMode="contain"
          />
        ) : (
          <Image
            style={styles.avatarFrame}
            source={require("@/assets/images/unknown_user.jpeg")}
          />
        )}
        <TouchableOpacity
          style={{
            zIndex: 2,
            position: "absolute",
            top: 0.25 * screenHeight - 0.25 * screenWidth,
            right: 0.33 * screenWidth,
            borderRadius: 18,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#c4c7cc",
          }}
          onPress={editImage}
        >
          <Ionicons name="camera-outline" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <EditProfileModal
        isVisible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    color: "#808080",
    height: screenHeight * 0.25,
  },
  avatarFrame: {
    height: screenWidth * 0.4,
    width: screenWidth * 0.4,
    borderWidth: 3,
    borderRadius: screenWidth * 0.4,
    borderColor: "grey",
    resizeMode: "contain",
    zIndex: 1,
  },
  userName: {
    fontFamily: "Dosis-Bold",
    fontSize: 38,
    alignSelf: "center",
  },
  userBio: {
    fontFamily: "Dosis-Regular",
    fontSize: 20,
    alignSelf: "center",
    color: "grey",
  },
  userInfoBox: {
    marginTop: 30,
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "white",
  },
  content: {
    padding: 15,
    marginTop: -15,
  },
});
