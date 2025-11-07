import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
    Image,
    ImageBackground,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Skeleton from "@/components/skeletons/skeleton";
import SkeletonCard from "@/components/skeletons/skeleton-card";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { MuscleGroupExerciseDTO, MuscleGroupType } from "@/state/endpoints/api.schemas";
import { useGetMuscleGroupById } from "@/state/endpoints/muscle-groups";
import BottomSheet from "@gorhom/bottom-sheet";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
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
            <ImageBackground source={images.logo} className="my-0 py-0 px-2.5 flex-1">
                <SafeAreaView className="flex-1">
                    <View className="my-2 flex-row justify-between items-center">
                        <Skeleton height={24} className="w-16" />
                        <Skeleton height={24} className="w-32" />
                    </View>

                    <View className="flex-row flex-wrap justify-between gap-y-2">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonCard key={`exercise-skeleton-${index}`} lines={2} className="w-[48%]" />
                        ))}
                    </View>
                </SafeAreaView>
            </ImageBackground>
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
                <View className="my-1 flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Image
                            source={icons.cross}
                            resizeMode="contain"
                            tintColor="#2AB38E"
                            className="mx-2"
                        />
                    </TouchableOpacity>
                </View>
                <Text className="font-pText text-xl text-white text-center">
                    {muscleGroup?.name}
                </Text>
                <FlashList
                    data={muscleGroup?.exercises ?? []}
                    renderItem={renderExercise}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                />
            </SafeAreaView>

            {selectedExercise && (
                <ExerciseBottomSheetComponent
                    ref={bottomSheetRef}
                    exercise={selectedExercise}
                    muscleGroupType={muscleGroup?.type ?? MuscleGroupType.NUMBER_1}
                    onClose={closeBottomSheet}
                />
            )}
        </ImageBackground>
    );
}