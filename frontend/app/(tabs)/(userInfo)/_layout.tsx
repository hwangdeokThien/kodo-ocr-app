import React, { useState } from "react";
import { useEffect } from "react";
import { View, Dimensions, Text, Platform } from "react-native";
import { StyleSheet, Image } from "react-native";
import { loadFonts } from "@/components/Fonts";
import InfoItem from "@/components/UserInfoItem";
import ParallaxScrollView from "@/components/ParallaxScrollView";

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

export default function UserInfoScreen() {
  const fontsLoaded = loadFonts();
  const [userInfo, setUserInfo] = useState<UserInfoProps>(staticData);
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
      } catch (err) {
        console.log(`Error fetching user information: ${err}`);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={require("@/assets/images/user-background.png")}
          style={styles.headerImage}
        />
      }
    >
      <View>
        {userInfo.avatar ? (
          <Image
            style={styles.avatarFrame}
            source={{ uri: userInfo.avatar }}
            resizeMode="contain"
          />
        ) : (
          <Image
            style={styles.avatarFrame}
            source={require("@/assets/images/unknown_user.jpeg")}
          />
        )}
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 20,
  },
  avatarFrame: {
    alignSelf: "center",
    height: screenWidth * 0.4,
    width: screenWidth * 0.4,
    borderWidth: 3,
    borderRadius: screenWidth * 0.4,
    borderColor: "grey",
    resizeMode: "contain",
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
});
