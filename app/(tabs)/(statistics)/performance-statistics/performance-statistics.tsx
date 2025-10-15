import { useFindPerformanceStatsSuspense } from "@/state/endpoints/statistics";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import PerformanceStatisticsView from "./performance-statistics-box";
import PerformanceStatisticsButton from "./performance-statistics-button";

interface TimePeriod {
    title: string,
    value: string
}

export default function PerformanceStatistics() {

    const periods: TimePeriod[] = [
        { title: 'Week', value: 'week' },
        { title: 'Month', value: 'month' },
        { title: 'Year', value: 'year' },
    ]
    const [timePeriod, setTimePeriod] = useState<TimePeriod>(periods[0]);

    const { data: stats, error, isLoading } = useFindPerformanceStatsSuspense({ timeInterval: timePeriod.value });

    if (isLoading) {
        return (
            <View className="flex-1 justify-center align-middle">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="mt-1 text-white">Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center align-middle">
                <Text className="mt-1 text-red-500">
                    Failed to load data. Please try again.
                </Text>
            </View>
        );
    }

    return (
        <View className="mt-[32px] w-full">
            <View className="w-full flex-row">
                <Text className="mr-[10px] text-lg text-white font-pText">
                    Statistics
                </Text>
                <View className="flex-1 flex-row">
                    {periods.map((period) => (
                        <PerformanceStatisticsButton
                            key={period.value}
                            title={period.title}
                            onClick={() => setTimePeriod(period)}
                            isSelected={timePeriod.value === period.value}
                        />
                    ))}
                </View>
            </View>

            <View className="mt-[20px] w-full flex-row">
                <PerformanceStatisticsView title={"Sessions Done"} data={stats.sessionsDone} />
                <PerformanceStatisticsView title={"Exercises Done"} data={stats.exercisesDone} />
                <PerformanceStatisticsView title={"Muscle Groups"} data={stats.muscleGroupsDone} />
            </View>
        </View>
    );
};
