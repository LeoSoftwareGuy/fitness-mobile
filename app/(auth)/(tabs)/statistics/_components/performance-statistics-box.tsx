import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";

interface PerformanceStatisticsViewProps {
    title: string;
    data: number;
}

export default function PerformanceStatisticsView({ title, data }: PerformanceStatisticsViewProps) {
    return (
        <LinearGradient
            colors={["rgba(107, 107, 107, 0.1)", "rgba(107, 107, 107, 0.6)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="mr-[16px] rounded-xl"
        >
            <View className="w-[110px] h-[87px] rounded-xl">
                <Text className=" text-white font-pText text-center text-[45px] ">
                    {data}
                </Text>
                <Text className="py-[6px] text-center text-[12px] text-white font-pText ">
                    {title}
                </Text>
            </View>
        </LinearGradient>
    );
};
