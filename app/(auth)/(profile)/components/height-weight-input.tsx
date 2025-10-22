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
        <View className="w-full">
            <View className="mb-2">
                <Text className="text-white font-pText text-base mb-2">
                    Height (cm)
                </Text>
                <View className="bg-[#2C2C2C] rounded-lg px-2 py-2.5">
                    <TextInput
                        className="text-white font-pRegular text-base"
                        keyboardType="numeric"
                        placeholder="Enter height"
                        placeholderTextColor="#666666"
                        value={height && height > 0 ? height.toString() : ""}
                        onChangeText={(text) => {
                            const value = parseInt(text) || 0;
                            onHeightChange(value);
                        }}
                    />
                </View>

            </View>

            <View className="mb-2">
                <Text className="text-white font-pText text-base mb-2">
                    Weight (kg)
                </Text>
                <View className="bg-[#2C2C2C] rounded-lg px-2 py-2.5">
                    <TextInput
                        className="text-white font-pRegular text-base"
                        keyboardType="numeric"
                        placeholder="Enter weight"
                        placeholderTextColor="#666666"
                        value={weight?.value && weight.value > 0 ? weight.value.toString() : ""}
                        onChangeText={(text) => {
                            const value = parseFloat(text) || 0;
                            onWeightChange({ value, unit: "kg" });
                        }}
                    />
                </View>
            </View>
        </View>
    );
}