import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { format, parseISO } from "date-fns";

export type ItemProps = {
    field: string;
    value: string | Date;
};

type StringMap = {
    [field: string]: keyof typeof Ionicons.glyphMap;
};

const iconTagForField: StringMap = {
    username: "happy-outline",
    email: "mail-outline",
    dateOfBirth: "planet-outline",
    location: "navigate-outline",
};

const InfoItem = ({ field, value }: ItemProps) => {
    const formatISODate = (isoDate: string): string => {
        const date = parseISO(isoDate);
        return format(date, "MMM dd, yyyy");
    };

    const displayValue =
        value instanceof Date ? formatISODate(value.toISOString()) : value;

    const handleTouch = () => {
        return value;
    };

    console.log(field);

    return (
        <TouchableOpacity onPress={handleTouch}>
            <View style={styles.iconContainer}>
                <Ionicons
                    name={iconTagForField[field]}
                    style={styles.iconStyle}
                />
            </View>
            <View></View>
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
    iconContainer: {
        height: 30,
        width: 30,
        backgroundColor: "transparent",
    },
    iconStyle: {
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

export default InfoItem;
