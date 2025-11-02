import { ExerciseSetDTO, MuscleGroupType } from "@/state/endpoints/api.schemas";
import React from "react";
import { Text, View } from "react-native";

interface BottomSheetExerciseInfoProps {
  set: ExerciseSetDTO;
}

const formatSetDetails = (set: ExerciseSetDTO): string => {
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
  const weightLabel = weightValue === 0 ? "BW" : `${weightValue} ${weightUnit}`;

  return `${repsLabel} × ${weightLabel}`;
};

export default function BottomSheetExerciseInfo({ set }: BottomSheetExerciseInfoProps) {
  return (
    <View className="px-2 py-0.8 rounded-lg bg-[#2A2A2A] justify-center items-center mr-0.8">
      <Text className="font-pText text-sm text-white">
        {formatSetDetails(set)}
      </Text>
    </View>
  );
}
