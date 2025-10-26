import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PerformanceStatisticsButtonProps {
    title: string;
    onClick: () => void;
    isSelected: boolean;
}

export default function PerformanceStatisticsButton({ title, isSelected, onClick }: PerformanceStatisticsButtonProps) {
    return (
        <TouchableOpacity onPress={onClick} className="flex-1 mr-1.1">
            {isSelected ? (
                <LinearGradient
                    colors={["#2AB38E", "#143129"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 20, paddingVertical: 7, paddingHorizontal: 25 }}
                >
                    <Text className="text-xs text-white font-pText">{title}</Text>
                </LinearGradient>
            ) : (
                <View className="rounded-xl py-0.7 px-2.5 items-center justify-center bg-grayForStats">
                    <Text className="text-xs text-white font-pText">{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};