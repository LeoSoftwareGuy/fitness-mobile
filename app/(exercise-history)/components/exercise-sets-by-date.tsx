import { SetHistory } from "@/state/endpoints/api.schemas";
import React from "react";
import { Text, View } from "react-native";

interface ExerciseSetsByDateComponentProps {
    date?: Date;
    setsInfo: SetHistory[];
}

export default function ExerciseSetsByDateComponent({ date, setsInfo, }: ExerciseSetsByDateComponentProps) {

    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
        : "Unknown Date";

    return (
        <View className="mb-6 p-4 bg-[#2C2C2C] rounded-xl">
            <Text className="mb-3 font-pText text-lg text-white">
                {formattedDate}
            </Text>

            <View className="flex-row flex-wrap gap-2">
                {setsInfo.map((set, index) => (
                    <View
                        key={index}
                        className="px-4 py-2 bg-[#3C3C3C] rounded-full"
                    >
                        <Text className="font-pText text-sm text-white">
                            {set.reps} × {set.weight.value === 0
                                ? "BW"
                                : `${set.weight.value}${set.weight.unit}`}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}