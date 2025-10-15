import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { TimePeriod } from "../[id]";

interface TimePeriodSelectorProps {
    selectedPeriod: TimePeriod;
    onSelectPeriod: (period: TimePeriod) => void;
}

export default function TimePeriodSelector({ selectedPeriod, onSelectPeriod, }: TimePeriodSelectorProps) {

    const periods: { label: string; value: TimePeriod }[] = [
        { label: "Week", value: "week" },
        { label: "Month", value: "month" },
        { label: "3 Months", value: "3months" },
        { label: "Year", value: "year" },
        { label: "Best", value: "best" },
        { label: "Latest", value: "latest" },
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-2"
        >
            {periods.map((period) => (
                <TouchableOpacity
                    key={period.value}
                    onPress={() => onSelectPeriod(period.value)}
                    className={`px-4 py-2 rounded-lg ${selectedPeriod === period.value
                        ? "bg-secondary"
                        : "bg-gray-700"
                        }`}
                >
                    <Text
                        className={`font-pText text-sm ${selectedPeriod === period.value
                            ? "text-white"
                            : "text-gray-400"
                            }`}
                    >
                        {period.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}