
import FitButton from "@/components/buttons/fit-button";
import { icons, images } from "@/constants";
import { TrainingSetWithDetails, useTrainingStore } from "@/hooks/use-trainings-store";
import { useCreateTraining } from "@/state/endpoints/trainings";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
    Alert,
    FlatList,
    Image,
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


    const renderExerciseGroup: ListRenderItem<ExerciseGroup> = ({ item }) => (
        <View className="mb-6 p-4 bg-[#2C2C2C] rounded-xl">
            <View className="mb-3 flex-row items-center">
                <Text className="flex-1 font-pText text-lg text-white">
                    {item.exerciseName}
                </Text>
            </View>

            <View className="flex-row flex-wrap gap-2">
                {item.sets.map((set, index) => (
                    <View
                        key={index}
                        className="px-4 py-2 bg-[#3C3C3C] rounded-full"
                    >
                        <Text className="font-pText text-sm text-white">
                            {set.reps} × {set.weight.value === 0 ? "BW" : `${set.weight.value}${set.weight.unit}`}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );

    return (
        <ImageBackground source={images.logo} className="my-0 py-0 px-1 flex-1">
            <SafeAreaView className="flex-1">
                {!currentTraining || groupedExercises.length === 0 ? (
                    <View className="flex-1">
                        <View className="py-2.5 flex-row items-center">
                            <TouchableOpacity onPress={() => router.back()}>
                                <Image
                                    source={icons.cross}
                                    resizeMode="contain"
                                    className="w-6 h-6"
                                />
                            </TouchableOpacity>
                            <Text className="flex-1 text-center font-pText text-xl text-white">
                                Today's workout
                            </Text>
                        </View>
                        <View className="px-8 flex-1 justify-center items-center">
                            <Text className="text-center text-2xl font-pText text-gray">
                                Haven't trained yet? Get your ass to the gym.
                            </Text>
                        </View>
                    </View>
                ) : (
                    <FlatList
                        data={groupedExercises}
                        renderItem={renderExerciseGroup}
                        keyExtractor={(item, index) => `${item.exerciseName}-${index}`}
                        contentContainerClassName="py-5"
                        ListHeaderComponent={
                            <View className="mb-4 py-2.5 flex-row items-center">
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Image
                                        source={icons.cross}
                                        resizeMode="contain"
                                        className="w-6 h-6"
                                    />
                                </TouchableOpacity>
                                <Text className="flex-1 text-center font-pText text-xl text-white">
                                    Today's workout
                                </Text>
                            </View>
                        }
                        ListFooterComponent={
                            <FitButton
                                title="Save today's workout"
                                isLoading={isPending}
                                handlePress={handleOnSubmit}
                                containerStyles="mt-[70px]"
                                buttonStyles={{
                                    paddingVertical: 17,
                                    paddingHorizontal: 38,
                                    borderRadius: 7,
                                }}
                            />
                        }
                    />
                )}
            </SafeAreaView>
        </ImageBackground>
    );
};
