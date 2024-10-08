import { Tabs } from "expo-router";
import React from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FEFDED",
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: "Dosis-ExtraBold",
          },
        }}
      />
      <Tabs.Screen
        name="(imageScan)"
        options={{
          title: "OCR",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "camera" : "camera-outline"}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: "Dosis-ExtraBold",
          },
        }}
      />
      <Tabs.Screen
        name="(userInfo)"
        options={{
          title: "Me",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: "Dosis-ExtraBold",
          },
        }}
      />
    </Tabs>
  );
}
