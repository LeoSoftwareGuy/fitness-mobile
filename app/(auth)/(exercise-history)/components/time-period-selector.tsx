import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TimePeriod } from "../[id]";

interface TimePeriodSelectorProps {
    selectedPeriod: TimePeriod;
    onSelectPeriod: (period: TimePeriod) => void;
}

export default function TimePeriodSelector({
    selectedPeriod,
    onSelectPeriod,
}: TimePeriodSelectorProps) {

    const periods: { label: string; value: TimePeriod }[] = [
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
        { label: "3 Months", value: "3months" },
    ];

    return (
        <View className="flex-row justify-between">
            {periods.map((period) => (
                <TouchableOpacity
                    key={period.value}
                    onPress={() => onSelectPeriod(period.value)}
                    className={`flex-1 mx-0.2 py-1.2 rounded-lg items-center ${selectedPeriod === period.value
                        ? "bg-secondary"
                        : "bg-transparent"
                        }`}
                >
                    <Text
                        className={`font-pText text-base ${selectedPeriod === period.value
                            ? "text-white"
                            : "text-white"
                            }`}
                    >
                        {period.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}