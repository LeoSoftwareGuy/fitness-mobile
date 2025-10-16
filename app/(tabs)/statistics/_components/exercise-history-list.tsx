
import { FindMuscleGroupsResponse } from "@/state/endpoints/api.schemas";
import { useFindMuscleGroups } from "@/state/endpoints/muscle-groups";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import PerformanceStatisticsButton from "./performance-statistics-button";

export default function ExerciseHistoryList() {
  const {
    data: muscleGroupsResponse,
    error,
    isLoading,
  } = useFindMuscleGroups({
    all: true,
    includeExercises: true,
  });

  const muscleGroups = muscleGroupsResponse?.items ?? [];

  const [chosenMuscleGroupId, setChosenMuscleGroupId] = useState<string | null>(
    muscleGroups[0]?.id ?? null
  );

  const selectedExercises = useMemo(() => {
    if (!chosenMuscleGroupId) return [];
    const selectedGroup = muscleGroups.find((mg) => mg.id === chosenMuscleGroupId);
    return selectedGroup?.exercises ?? [];
  }, [chosenMuscleGroupId, muscleGroups]);

  const selectMuscleGroup = useCallback((id: string) => {
    setChosenMuscleGroupId(id);
  }, []);

  const renderMuscleGroupButton: ListRenderItem<FindMuscleGroupsResponse> = ({ item }) => (
    <PerformanceStatisticsButton
      title={item.name}
      onClick={() => selectMuscleGroup(item.id)}
      isSelected={chosenMuscleGroupId === item.id}
    />
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="mt-2.5 text-white">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="mt-2.5 text-red-500">
          Failed to load data. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <View className="mt-[30px] w-full">
      <Text className="mb-5 font-pText text-white text-lg">Exercises</Text>

      <FlatList
        data={muscleGroups}
        renderItem={renderMuscleGroupButton}
        horizontal
        keyExtractor={(item) => item.id}
        contentContainerClassName="gap-2.5"
        showsHorizontalScrollIndicator={false}
      />

      <View className="mt-10 w-full">
        {selectedExercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            onPress={() => router.push(`/`)}
            className="border-t-[0.2px] border-b-[0.2px] border-[#9A9A9A]"
          >
            <Text className="py-[15px] font-pRegular text-[17px] text-white">
              {exercise.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}