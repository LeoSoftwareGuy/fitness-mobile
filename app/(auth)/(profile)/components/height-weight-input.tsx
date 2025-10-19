import { Weight } from "@/state/endpoints/api.schemas";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface HeightWeightInputProps {
    height?: number;
    weight?: Weight;
    onHeightChange: (height: number) => void;
    onWeightChange: (weight: Weight) => void;
}

export default function HeightWeightInput({
    height,
    weight,
    onHeightChange,
    onWeightChange,
}: HeightWeightInputProps) {
    return (
        <View className="mt-4 w-full">
            <View className="mb-4">
                <Text className="mb-2 font-pText text-base text-white">
                    Height (cm)
                </Text>
                <TextInput
                    className="px-4 py-3 w-full bg-gray-800 rounded-lg text-white font-pRegular"
                    keyboardType="numeric"
                    placeholder="Enter height in cm"
                    placeholderTextColor="#9CA3AF"
                    value={height?.toString() || ""}
                    onChangeText={(text) => {
                        const value = parseInt(text) || 0;
                        onHeightChange(value);
                    }}
                />
            </View>

            <View className="mb-4">
                <Text className="mb-2 font-pText text-base text-white">
                    Weight (kg)
                </Text>
                <TextInput
                    className="px-4 py-3 w-full bg-gray-800 rounded-lg text-white font-pRegular"
                    keyboardType="numeric"
                    placeholder="Enter weight in kg"
                    placeholderTextColor="#9CA3AF"
                    value={weight?.value?.toString() || ""}
                    onChangeText={(text) => {
                        const value = parseFloat(text) || 0;
                        onWeightChange({ value, unit: "kg" });
                    }}
                />
            </View>
        </View>
    );
}