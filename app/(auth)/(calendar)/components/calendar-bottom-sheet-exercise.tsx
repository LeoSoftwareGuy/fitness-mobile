import { ExerciseGroupDTO, ExerciseSetDTO } from "@/state/endpoints/api.schemas";
import { BottomSheetFlatList, BottomSheetView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ListRenderItem, Text } from "react-native";
import BottomSheetExerciseInfo from "./calendar-bottom-sheet-exercise-info";

interface BottomSheetUniqueExerciseProps {
  uniqueExercise: ExerciseGroupDTO;
}

export default function CalendarBottomSheetExercise({ uniqueExercise }: BottomSheetUniqueExerciseProps) {

  const renderItem: ListRenderItem<ExerciseSetDTO> = ({ item }) => (
    <BottomSheetExerciseInfo
      reps={item.reps || 0}
      weight={item.weight}
    />
  );

  const keyExtractor = (item: ExerciseSetDTO) => item.id;

  return (
    <BottomSheetView className="mb-1.5 mx-1.5 bg-transparent rounded-xl">
      <LinearGradient
        colors={["rgba(42, 179, 142, 0.15)", "rgba(42, 179, 142, 0.4)"]}
        className="rounded-xl"
      >
        <Text className="px-1 pt-1 pb-0.5 font-pText text-xs text-white">
          {uniqueExercise.name}
        </Text>
        <BottomSheetFlatList
          data={uniqueExercise.exerciseSets}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-1 pb-1 gap-0.5"
        />
      </LinearGradient>
    </BottomSheetView>
  );
}