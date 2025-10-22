import { Text, TextInput, View } from "react-native";

import React from "react";

interface ProfileFieldProps {
    title: string;
    value: string;
    handleChangeText: (e: string) => void;
    otherStyles?: string;
    keyboardType?: string;
    placehorder?: string;
}

export default function ProfileField({
    title,
    value,
    handleChangeText,
    otherStyles,
    placehorder,
}: ProfileFieldProps) {
    return (
        <View className="mb-2.5">
            <Text className="text-white font-pText text-base mb-2">{title}</Text>
            <View className="bg-[#2C2C2C] rounded-lg px-2 py-2.5">
                <TextInput
                    className="text-white font-pRegular text-base"
                    value={value}
                    placeholder={placehorder}
                    placeholderTextColor="white"
                    selectionColor="#006F52"
                    onChangeText={handleChangeText}
                />
            </View>
        </View>
    );
};

