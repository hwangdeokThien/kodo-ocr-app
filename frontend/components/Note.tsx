import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

export type NoteProps = {
    title: string;
    content: string;
    accessedDate: string;
};

const Note = ({ title, content, accessedDate }: NoteProps) => {
    const formattedDate = new Date(accessedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    return (
        <TouchableOpacity style={styles.cardContainer}>
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: "row" }}>
                    <Ionicons name="newspaper" style={styles.iconHeder} />
                    <Text style={styles.cardHeaderText}>{title}</Text>
                </View>
                <Text style={styles.dateFormat}>{formattedDate}</Text>
            </View>
            <View style={styles.cardContent}>
                <Text style={styles.cardContentText} numberOfLines={4}>
                    {content}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        borderWidth: 4,
        borderRadius: 20,
        justifyContent: "flex-start",
        borderColor: "#0A6847",
        shadowColor: "black",
        shadowRadius: 2,
        shadowOpacity: 0.1,
    },
    iconHeder: {
        fontSize: 25,
        color: "white",
    },
    cardHeader: {
        flexDirection: "row",
        backgroundColor: "#40A578",
        justifyContent: "space-between",
        padding: 15,
        alignItems: "center",
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        borderBottomColor: "#0A6847",
        borderBottomWidth: 1,
    },
    cardHeaderText: {
        marginLeft: 5,
        fontFamily: "Dosis-Bold",
        color: "white",
        fontSize: 20,
    },
    cardContent: {
        backgroundColor: "white",
        padding: 15,
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
    },
    cardContentText: {
        fontFamily: "Dosis-Regular",
        fontSize: 15,
        color: "black",
    },
    dateFormat: {
        fontFamily: "Dosis-Regular",
        fontSize: 15,
        color: "white",
    },
});

export default Note;
