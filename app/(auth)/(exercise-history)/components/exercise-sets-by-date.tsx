import { SetHistory } from "@/state/endpoints/api.schemas";
import React from "react";
import { Text, View } from "react-native";

interface ExerciseSetsByDateComponentProps {
    date?: Date;
    setsInfo: SetHistory[];
}

export default function ExerciseSetsByDateComponent({
    date,
    setsInfo,
}: ExerciseSetsByDateComponentProps) {

    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        : "Unknown Date";

    return (
        <View className="mb-1.5 p-1.5 bg-[#3A3A3A] rounded-xl">
            <Text className="mb-1 font-pText text-base text-white">
                {formattedDate}
            </Text>

            <View className="flex-row flex-wrap gap-0.5">
                {setsInfo.map((set, index) => (
                    <View
                        key={index}
                        className="px-2 py-1 bg-[#2A2A2A] rounded-lg"
                    >
                        <Text className="font-pText text-sm text-white">
                            {set.reps} × {set.weight.value === 0
                                ? "BW"
                                : `${set.weight.value} ${set.weight.unit}`}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}