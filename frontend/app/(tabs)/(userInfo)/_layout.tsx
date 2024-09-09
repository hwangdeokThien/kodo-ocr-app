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
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfileModal from "./editProfileModal";

type UserInfoProps = {
  username: string;
  name: string;
  email: string;
  bio: string;
  avatar?: string;
  dateOfBirth?: Date;
  location?: string;
  createdAt?: Date;
};

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

const id = "666af03498a1b21ae5b96fb5";
const staticData: UserInfoProps = {
  username: "Unknown",
  name: "Unknown",
  email: "Unknown",
  bio: "",
  avatar: undefined,
  dateOfBirth: undefined,
  location: "Unknown",
  createdAt: undefined,
};
const AVATAR_STORAGE_KEY = "@user_avatar";

export default function UserInfoScreen() {
  const fontsLoaded = loadFonts();
  const [userInfo, setUserInfo] = useState<UserInfoProps>(staticData);
  const [image, setImage] = useState<any>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const URL =
    Platform.OS === "ios"
      ? process.env.EXPO_PUBLIC_URL_IOS
      : process.env.EXPO_PUBLIC_URL_ANDROID;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log(URL);
        const response = await fetch(`${URL}/api/users/${id}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.status}`);
        }

        const parseStringToObject = (str: string): Record<string, any> => {
          const obj: Record<string, any> = {};
          const pairs = str.match(/(\w+):\s*'(.*?)'/g);

          if (pairs) {
            pairs.forEach((pair) => {
              const [key, value] = pair.split(/:\s*'/);
              const cleanKey = key.trim();
              const cleanValue = value.replace(/'$/, "").trim();
              obj[cleanKey] = cleanValue;
            });
          }

          return obj;
        };

        const textData = await response.text();
        console.log(textData);

        const userData = parseStringToObject(textData) as UserInfoProps;
        console.log(userData);
        setUserInfo(userData);
        const storedAvatar = await AsyncStorage.getItem(AVATAR_STORAGE_KEY);
        if (storedAvatar) {
          setImage(storedAvatar);
        } else if (userData.avatar) {
          setImage(userData.avatar);
        }
      } catch (err) {
        console.log(`Error fetching user information: ${err}`);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSaveProfile = async (
    username: string,
    dateOfBirth: string,
    email: string,
    location: string
  ) => {
    const updatedUserInfo: UserInfoProps = {
      ...userInfo,
      username,
      dateOfBirth: new Date(dateOfBirth),
      email,
      location,
    };
    setUserInfo(updatedUserInfo);

    try {
      await AsyncStorage.setItem("@user_info", JSON.stringify(updatedUserInfo));
      console.log("User info saved to AsyncStorage");
    } catch (error) {
      console.log("Error saving user info", error);
    }
    setEditModalVisible(false);
  };

  const editImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
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
          <Text style={styles.userBio}>{userInfo.bio}</Text>
          <View style={styles.userInfoBox}>
            {Object.entries(userInfo)
              .filter(([field]) => !["name", "bio", "avatar"].includes(field))
              .map(([field, value]) => (
                <InfoItem key={field} field={field} value={value} />
              ))}
          </View>
        </View>
        <View style={{ height: screenWidth * 0.15 }} />
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={{
              borderColor: "grey",
              borderWidth: 2,
              borderRadius: 10,
              backgroundColor: "white",
              padding: 10,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              width: screenWidth * 0.6,
            }}
            onPress={() => {
              setEditModalVisible(true);
            }}
          >
            <AntDesign name="edit" size={24} color="black" />
            <Text style={{ fontFamily: "Dosis-Regular", fontSize: 24 }}>
              {`     `} Edit profile
            </Text>
          </TouchableOpacity>
        </View>
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
            backgroundColor: "#cccccc",
          }}
          onPress={editImage}
        >
          <Entypo name="camera" size={20} color="black" />
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
    marginTop: 10,
    borderColor: "grey",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "white",
  },
  content: {
    padding: 15,
  },
});
