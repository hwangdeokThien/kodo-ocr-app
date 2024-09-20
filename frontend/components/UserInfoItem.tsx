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

    return (
        <View style={styles.itemRow}>
            <View style={styles.labelContainer}>
                <Ionicons
                    name={iconTagForField[field]}
                    style={styles.iconStyle}
                />
                <Text style={styles.iconText}>{field}</Text>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.contentText}>
                    {typeof value !== 'undefined' ? 
                        (typeof value === 'string' ? value : value.toString()) 
                        : 
                        null
                    }
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    itemRow: {
        borderWidth: 4,
        borderRadius: 4,
        borderColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35,
    },
    labelContainer: {
        backgroundColor: "transparent",
        flexDirection: 'row',
        justifyContent: 'center',
        marginRight: 4,
    },
    contentContainer: {
        width: 200
    },
    iconStyle: {
        fontSize: 25,
        color: "black",
        marginRight: 5,
    },
    iconText: {
        fontFamily: "Dosis-Bold",
        fontSize: 18,
        color: "grey",
    },
    contentText: {
        fontFamily: "Dosis-Bold",
        fontSize: 18,
        color: "#0A6847",
    },
    dateFormat: {
        fontFamily: "Dosis-Regular",
        fontSize: 15,
        color: "black",
    },
});

export default InfoItem;
