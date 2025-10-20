import { useGetExerciseHistory } from "@/state/endpoints/statistics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";

interface ExerciseStatisticsProps {
    resultType: "best" | "latest";
    exerciseId: string;
}

export default function ExerciseStatistics({ resultType, exerciseId }: ExerciseStatisticsProps) {
    const resultName = useMemo(() => {
        return resultType === "best" ? "Best result" : "Last result";
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
                sets: exerciseStats.bestResult.maxReps,
                weight: exerciseStats.bestResult.maxWeight,
            };
        }

        return null;
    }, [exerciseStats, resultType]);

    if (isLoading) {
        return (
            <View className="py-2 items-center">
                <ActivityIndicator size="small" color="#ffffff" />
            </View>
        );
    }

    if (error || !displayData) {
        return null;
    }

    return (
        <LinearGradient
            colors={["rgba(107, 107, 107, 0.2)", "rgba(107, 107, 107, 0.8)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            className="mt-0.8 rounded-lg border border-black"
        >
            <View className="p-1.2">
                <Text className="text-lg text-white font-pRegular text-center mb-0.5">
                    {resultName}
                </Text>
                <View className="flex-row items-center justify-center gap-0.8">
                    <Text className="text-sm text-white font-pRegular">
                        {displayData.reps} reps
                    </Text>
                    {displayData.sets && (
                        <>
                            <Text className="text-sm text-white">•</Text>
                            <Text className="text-sm text-white font-pRegular">
                                {displayData.sets} sets
                            </Text>
                        </>
                    )}
                    <Text className="text-sm text-white">•</Text>
                    <Text className="text-sm text-white font-pRegular">
                        {displayData.weight.value === 0
                            ? "BW"
                            : `${displayData.weight.value}${displayData.weight.unit}`}
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
}