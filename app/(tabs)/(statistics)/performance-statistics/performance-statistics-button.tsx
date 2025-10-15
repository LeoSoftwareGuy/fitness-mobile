import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";


interface PerformanceStatisticsButtonProps {
    title: string;
    onClick: (text: string) => void;
    isSelected: boolean;
}

export default function PerformanceStatisticsButton({ title, isSelected, onClick }: PerformanceStatisticsButtonProps) {
    return (
        <TouchableOpacity onPress={() => onClick(title.toLowerCase())} className="mr-[11px] rounded-lg">
            {isSelected ? (
                <LinearGradient
                    colors={["#2AB38E", "#143129"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-0.2 rounded-lg"
                >
                    <View className="rounded-md py-[7px] px-[25px] align-middle justify-center">
                        <Text className="text-[12px] text-center text-white font-pText">{title}</Text>
                    </View>
                </LinearGradient>
            ) : (
                <View className="rounded-md py-[7px] px-[25px] align-middle justify-center bg-grayForStats">
                    <Text className="text-[12px] text-center text-white font-pText">{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};
