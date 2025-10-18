import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    ListRenderItem,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import images from "@/constants/images";
import { MuscleGroupExerciseDTO } from "@/state/endpoints/api.schemas";
import { useGetMuscleGroupById } from "@/state/endpoints/muscle-groups";
import BottomSheet from "@gorhom/bottom-sheet";
import ExerciseComponent from "./components/exercise";
import ExerciseBottomSheetComponent from "./components/exercise-bottom-sheet";

export default function MuscleGroupScreen() {
    const { id } = useLocalSearchParams();
    const {
        data: muscleGroup,
        isLoading,
        error,
    } = useGetMuscleGroupById(id as string);

    const [selectedExercise, setSelectedExercise] = useState<MuscleGroupExerciseDTO | null>(null);

    const bottomSheetRef = useRef<BottomSheet>(null);

    const expandBottomSheet = useCallback(() => {
        bottomSheetRef.current?.expand();
    }, []);

    const closeBottomSheet = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);

    const onSelectExercise = useCallback((exercise: MuscleGroupExerciseDTO) => {
        setSelectedExercise(exercise);
        expandBottomSheet();
    }, [expandBottomSheet]);

    const renderExercise: ListRenderItem<MuscleGroupExerciseDTO> = ({ item }) => (
        <ExerciseComponent
            exercise={item}
            onClick={() => onSelectExercise(item)}
        />
    );

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className="mt-2.5 text-white">Loading exercises...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <Text className="text-red-500 text-base">Failed to load exercises.</Text>
            </View>
        );
    }

    return (
        <ImageBackground source={images.logo} className="my-0 py-0 px-2.5 flex-1">
            <SafeAreaView className="flex-1">
                <Text className=" mt-3 text-center font-pText text-xl text-white">
                    {muscleGroup?.name}
                </Text>

                <FlatList
                    data={muscleGroup?.exercises ?? []}
                    renderItem={renderExercise}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerClassName="py-2"
                    columnWrapperClassName="gap-2"
                />
            </SafeAreaView>

            {selectedExercise && (
                <ExerciseBottomSheetComponent
                    ref={bottomSheetRef}
                    exercise={selectedExercise}
                    onClose={closeBottomSheet}
                />
            )}
        </ImageBackground>
    );
}