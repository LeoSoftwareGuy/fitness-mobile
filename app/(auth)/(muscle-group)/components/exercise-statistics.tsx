import { useGetExerciseHistory } from "@/state/endpoints/statistics";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { ActivityIndicator, Text } from "react-native";

interface ExerciseStatisticsProps {
    resultType: "best" | "latest";
    exerciseId: string;
}

export default function ExerciseStatistics({ resultType, exerciseId }: ExerciseStatisticsProps) {
    const resultName = useMemo(() => {
        return resultType === "best" ? "Best Result" : "Last Result";
    }, [resultType]);

    const { data: exerciseStats, error, isLoading } = useGetExerciseHistory(
        exerciseId,
        {
            exerciseId,
            timeInterval: resultType,
        }
    );

    const displayData = useMemo(() => {
        if (!exerciseStats) return null;

        if (resultType === "latest" && exerciseStats.lastWorkout) {
            return {
                reps: exerciseStats.lastWorkout.totalReps,
                sets: exerciseStats.lastWorkout.setCount,
                weight: exerciseStats.lastWorkout.weight,
            };
        }

        if (resultType === "best" && exerciseStats.bestResult) {
            return {
                reps: exerciseStats.bestResult.repsAtMaxWeight,
                weight: exerciseStats.bestResult.maxWeight,
                maxReps: exerciseStats.bestResult.maxReps,
                weightAtMaxReps: exerciseStats.bestResult.weightAtMaxReps,
            };
        }

        return null;
    }, [exerciseStats, resultType]);

    if (isLoading) {
        return (
            <BottomSheetView className="flex-1 justify-center items-center py-4">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="mt-2.5 text-white">Loading...</Text>
            </BottomSheetView>
        );
    }

    if (error) {
        return (
            <BottomSheetView className="flex-1 justify-center items-center py-4">
                <Text className="mt-2.5 text-red-500">
                    Failed to load data. Please try again.
                </Text>
            </BottomSheetView>
        );
    }

    if (!displayData) {
        return (
            <BottomSheetView className="mt-2 rounded-lg border-2 border-gray-700 p-3">
                <Text className="py-1 text-center text-lg text-white font-pRegular">
                    {resultName}
                </Text>
                <Text className="text-center text-sm text-gray-400">No data available</Text>
            </BottomSheetView>
        );
    }

    return (
        <LinearGradient
            colors={["rgba(107, 107, 107, 0.1)", "rgba(107, 107, 107, 1)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="mt-2 rounded-lg border-2 border-black"
        >
            <BottomSheetView className="w-full p-3">
                <Text className="py-1 text-center text-lg text-white font-pRegular">
                    {resultName}
                </Text>
                <BottomSheetView className="flex-row items-center justify-center gap-5">
                    <Text className="pb-1 text-sm text-white font-pRegular">
                        {displayData.reps} reps
                    </Text>
                    <Text className="pb-1 text-sm text-white font-pRegular">
                        {displayData.weight.value === 0
                            ? "BW"
                            : `${displayData.weight.value}${displayData.weight.unit}`}
                    </Text>
                </BottomSheetView>
            </BottomSheetView>
        </LinearGradient>
    );
};