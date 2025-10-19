// CalendarBottomSheet.tsx
import { ExerciseGroupDTO, TrainingDayDTO } from "@/state/endpoints/api.schemas";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { forwardRef, useCallback, useMemo } from "react";
import { ListRenderItem, Text } from "react-native";
import CalendarBottomSheetExercise from "./calendar-bottom-sheet-exercise";

interface Props {
  title: string;
  training: TrainingDayDTO;
  onClose: () => void;
}

type Ref = BottomSheet;

const CalendarBottomSheet = forwardRef<Ref, Props>((props, ref) => {
  const allUniqueExercises = useMemo(() => {
    // Group by muscle group, then flatten
    const grouped = props.training.exercises.reduce((acc, exercise) => {
      if (!acc[exercise.muscleGroupName]) {
        acc[exercise.muscleGroupName] = [];
      }
      acc[exercise.muscleGroupName].push(exercise);
      return acc;
    }, {} as Record<string, ExerciseGroupDTO[]>);

    return Object.values(grouped).flat();
  }, [props.training.exercises]);

  const snapPoints = useMemo(() => ["40%", "60%", "80%"], []);

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...backdropProps}
      />
    ),
    []
  );

  const renderItem: ListRenderItem<ExerciseGroupDTO> = ({ item }) => (
    <CalendarBottomSheetExercise uniqueExercise={item} />
  );

  const keyExtractor = (exercise: ExerciseGroupDTO) => exercise.id;

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "transparent" }}
      backgroundStyle={{ backgroundColor: "transparent" }}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onClose={props.onClose}
    >
      {/* Header with Gradient */}
      <LinearGradient colors={["#05251C", "#0E6149"]} className="pb-[30px] rounded">
        <BottomSheetView className="px-[10px] pt-6 flex-row items-center">
          <Text className="pl-3 text-base font-normal leading-5 text-white font-pRegular">
            {props.title}
          </Text>
          <Text className="pl-4 text-2xl font-normal leading-6 text-white font-pText">
            Workout day
          </Text>
        </BottomSheetView>
      </LinearGradient>

      {/* FlatList with Dark Background */}
      <BottomSheetFlatList
        data={allUniqueExercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerClassName="bg-[#131313] py-5"
      />
    </BottomSheet>
  );
});

CalendarBottomSheet.displayName = "CalendarBottomSheet";

export default CalendarBottomSheet;