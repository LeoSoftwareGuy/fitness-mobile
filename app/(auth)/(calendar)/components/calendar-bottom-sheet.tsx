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
      <LinearGradient
        colors={["#05251C", "#0E6149"]}
        className="rounded-t-2xl pb-1.5"
      >
        <BottomSheetView className="px-1.5 pt-2 flex-row items-center">
          <Text className="text-sm font-pRegular text-white">
            {props.title}
          </Text>
          <Text className="ml-2 text-xl font-pText text-white">
            Workout day
          </Text>
        </BottomSheetView>
      </LinearGradient>

      <BottomSheetFlatList
        data={allUniqueExercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerClassName="bg-primary pt-2 pb-2"
      />
    </BottomSheet>
  );
});

CalendarBottomSheet.displayName = "CalendarBottomSheet";

export default CalendarBottomSheet;