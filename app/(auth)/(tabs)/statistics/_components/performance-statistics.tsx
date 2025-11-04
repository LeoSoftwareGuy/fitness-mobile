import { useFindPerformanceStatsSuspense } from "@/state/endpoints/statistics";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import ExerciseHistoryList from "./exercise-history-list";
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

    const { data: stats, error, isLoading, isFetching } = useFindPerformanceStatsSuspense({ timeInterval: timePeriod.value });

    if (isLoading && !stats) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="mt-1 text-white">Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="mt-1 text-red-500">
                    Failed to load data. Please try again.
                </Text>
            </View>
        );
    }
    return (
        <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
            <View className="mt-3.2 w-full">
                <View className="w-full flex-row items-center">
                    <Text className="mr-1 text-lg text-white font-pText">
                        Period
                    </Text>
                    <View className="flex-1 flex-row gap-1.5">
                        {periods.map((period) => (
                            <PerformanceStatisticsButton
                                key={period.value}
                                title={period.title}
                                onClick={() => setTimePeriod(period)}
                                isSelected={timePeriod.value === period.value}
                            />
                        ))}
                    </View>
                    {isFetching && (
                        <ActivityIndicator size="small" color="#2AB38E" className="ml-2" />
                    )}
                </View>

                <View className="mt-2 w-full flex-row gap-1.5">
                    <PerformanceStatisticsView title={"Sessions Done"} data={stats?.sessionsDone ?? 0} />
                    <PerformanceStatisticsView title={"Exercises Done"} data={stats?.exercisesDone ?? 0} />
                    <PerformanceStatisticsView title={"Muscle Groups"} data={stats?.muscleGroupsDone ?? 0} />
                </View>

                <ExerciseHistoryList />
            </View>
        </ScrollView>
    );
};