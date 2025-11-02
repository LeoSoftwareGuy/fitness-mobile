import { ExerciseGroupDTO, ExerciseSetDTO } from "@/state/endpoints/api.schemas";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, ListRenderItem, Text, View } from "react-native";
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

  const keyExtractor = (item: ExerciseSetDTO, index: number) => `${item.id}-${index}`;

  return (
    <View className="mb-1.2 mx-1.5">
      <LinearGradient
        colors={["rgba(107, 107, 107, 0.1)", "rgba(107, 107, 107, 0.6)"]}
        style={{ borderRadius: 10, overflow: 'hidden' }}
      >
        <Text className="px-1.5 pt-1.2 pb-0.8 font-pText text-sm text-white">
          {uniqueExercise.name}
        </Text>
        <FlatList
          data={uniqueExercise.exerciseSets}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingBottom: 12,
            gap: 8
          }}
        />
      </LinearGradient>
    </View>
  );
}