import React, { useState } from "react";
import { useEffect } from "react";
import { View, Dimensions, Text } from "react-native";
import { StyleSheet, Image } from "react-native";
import { loadFonts } from "@/components/Fonts";
import ParallaxScrollView from "@/components/ParallaxScrollView";

type UserInfoProps = {
    username: string;
    name: string;
    email: string;
    avatar?: string;
};

const screenWidth = Dimensions.get("screen").width;

const id = "666a6cb533295f9308dacdb7";
const staticData: UserInfoProps = {
    username: "Unkown",
    name: "Unkown",
    email: "Unkown",
    avatar: "Unkown",
};

export default function UserInfoScreen() {
    const fontsLoaded = loadFonts();
    const [userInfo, setUserInfo] = useState<UserInfoProps>(staticData);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3009/api/users/${id}`,
                    {
                        method: "GET",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(
                        `Error fetching user data: ${response.status}`
                    );
                }

                const textData = await response.text();
                const jsonData = JSON.parse(
                    textData
                        .replace(/ObjectId\('(\w+)'\)/g, '"$1"')
                        .replace(/(\w+):/g, '"$1":')
                        .replace(/'/g, '"')
                        .replace("new ", "")
                );
                const { username, name, email } = jsonData;
                const userInfo = { username, name, email } as UserInfoProps;
                // console.log(userInfo);
                setUserInfo(userInfo);
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
                <Image
                    source={require("@/assets/images/profile-picture.jpeg")}
                    style={styles.avatarFrame}
                />
                <Text style={styles.userName}>{userInfo.name}</Text>
                <Text style={styles.userEmail}>{userInfo.email}</Text>
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
        fontSize: 35,
        alignSelf: "center",
    },
    userEmail: {
        fontFamily: "Dosis-Regular",
        fontSize: 15,
        alignSelf: "center",
        color: "grey",
    },
});
