import FitButton from "@/components/buttons/fit-button";
import { images } from "@/constants";
import { TrainingSetWithDetails, useTrainingStore } from "@/hooks/use-trainings-store";
import { MuscleGroupType } from "@/state/endpoints/api.schemas";
import { useCreateTraining } from "@/state/endpoints/trainings";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
    Alert,
    FlatList,
    ImageBackground,
    ListRenderItem,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ExerciseGroup {
    exerciseName: string;
    exerciseImageUrl?: string;
    sets: TrainingSetWithDetails[]
}

export default function TodaysWorkoutScreen() {

    const currentTraining = useTrainingStore((c) => c.currentTraining);
    const clearExercisesFromLocalStorage = useTrainingStore((c) => c.clearTraining);
    const trainingRequest = useTrainingStore((c) => c.getCreateTrainingRequest);

    const { mutateAsync, isPending } = useCreateTraining({
        mutation: {
            onSuccess: () => {
                Alert.alert("Success", "Workout saved successfully!");
                clearExercisesFromLocalStorage();
            },
            onError: () => {
                Alert.alert("Error", "Failed to save workout");
            }
        }
    });

    const handleOnSubmit = async () => {
        const request = trainingRequest();
        if (request) {
            await mutateAsync({ data: request });
        }
    };

    // Group sets by exercise
    const groupedExercises = useMemo((): ExerciseGroup[] => {
        if (!currentTraining?.sets) return [];

        const groups = currentTraining.sets.reduce((acc, set) => {
            const key = set.exerciseName;
            if (!acc[key]) {
                acc[key] = {
                    exerciseName: set.exerciseName,
                    sets: []
                };
            }
            acc[key].sets.push(set);
            return acc;
        }, {} as Record<string, ExerciseGroup>);

        return Object.values(groups);
    }, [currentTraining?.sets]);


    const formatSetSummary = (set: TrainingSetWithDetails): string => {
        if (set.muscleGroupType === MuscleGroupType.NUMBER_3) {
            const paceLabel = set.pace !== undefined ? `${set.pace} km/h` : "- km/h";
            const durationMinutes = set.duration ? set.duration / 60 : undefined;
            const durationLabel =
                durationMinutes !== undefined
                    ? `${Number.isInteger(durationMinutes) ? durationMinutes : durationMinutes.toFixed(1)} min`
                    : "- min";
            const elevationLabel =
                set.elevation !== undefined ? `${set.elevation} m` : "- m";

            return `${paceLabel} • ${durationLabel} • ${elevationLabel}`;
        }

        const repsLabel = set.reps ?? "-";
        const weightValue = set.weight?.value ?? 0;
        const weightUnit = set.weight?.unit ?? "kg";
        const weightLabel = weightValue === 0 ? "BW" : `${weightValue}${weightUnit}`;

        return `${repsLabel} × ${weightLabel}`;
    };

    const renderExerciseGroup: ListRenderItem<ExerciseGroup> = ({ item }) => (
        <View className="mx-2 mb-1.8 px-1.8 py-1.5 bg-white/5 rounded-xl">
            <View className="mb-1.2 flex-row justify-between items-start">
                <Text className="flex-1 font-pRegular text-base text-white">
                    {item.exerciseName} ({item.sets.length} sets)
                </Text>
                <TouchableOpacity>
                    <Text className="font-pRegular text-xs text-darkGray">change</Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap gap-0.8">
                {item.sets.map((set, index) => (
                    <View
                        key={index}
                        className="px-1.6 py-0.8 bg-[#3C3C3C] rounded-full"
                    >
                        <Text className="font-pRegular text-xs text-white">
                            {formatSetSummary(set)}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <ImageBackground source={images.logo} className="flex-1">
            <SafeAreaView className="flex-1">
                {!currentTraining || groupedExercises.length === 0 ? (

                    <View className="flex-1">
                        <View className="px-2 pt-1.5 flex-row justify-between items-center mb-1">
                            <TouchableOpacity onPress={() => router.replace("/")}>
                                <Text className="text-white text-sm font-pRegular">← Back</Text>
                            </TouchableOpacity>
                            <Text className=" flex-1 text-center font-pText text-xl text-white">
                                Today's workout
                            </Text>
                        </View>
                        <View className="flex-1 justify-center items-center px-3">
                            <Text className="text-center text-lg font-pRegular text-gray">
                                Haven't trained yet? Get your ass to the gym.
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View className="flex-1">
                        <View className="mb-1 px-2 pt-1.5 flex-row justify-between items-center">
                            <TouchableOpacity onPress={() => router.replace("/")}>
                                <Text className="text-white text-sm font-pRegular">← Back</Text>
                            </TouchableOpacity>
                            <Text className="flex-1 text-center font-pText text-xl text-white">
                                Today's workout
                            </Text>
                        </View>
                        <FlatList
                            data={groupedExercises}
                            renderItem={renderExerciseGroup}
                            keyExtractor={(item, index) => `${item.exerciseName}-${index}`}
                            contentContainerStyle={{ paddingBottom: 20 }}
                        />
                        <View className="px-2 pb-2">
                            <FitButton
                                title="Save today's workout"
                                isLoading={isPending}
                                handlePress={handleOnSubmit}
                                containerStyles=""
                                buttonStyles={{
                                    paddingVertical: 17,
                                    paddingHorizontal: 38,
                                    borderRadius: 7,
                                }}
                            />
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </ImageBackground >
    );
};
