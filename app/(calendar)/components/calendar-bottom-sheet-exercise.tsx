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
    <BottomSheetView className="mb-4 ml-[15px] min-h-[80px] bg-transparent rounded-[15px] self-start">
      <LinearGradient
        colors={["rgba(107, 107, 107, 0.1)", "rgba(107, 107, 107, 0.6)"]}
        className="rounded-xl"
      >
        <Text className="pl-2 pt-2 pb-2 font-pText text-xs leading-[22px] font-normal text-white">
          {uniqueExercise.name}
        </Text>
        <BottomSheetFlatList
          data={uniqueExercise.exerciseSets}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-[9px] pb-[9px] flex-row gap-2"
        />
      </LinearGradient>
    </BottomSheetView>
  );
};