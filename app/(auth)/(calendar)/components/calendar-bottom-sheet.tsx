import { ExerciseGroupDTO, TrainingDayDTO } from "@/state/endpoints/api.schemas";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { forwardRef, useCallback, useMemo } from "react";
import { ListRenderItem, Text, View } from "react-native";
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
        appearsOnIndex={1}
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
      index={0}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: "#fff", width: 40, height: 4 }}
      backgroundStyle={{ backgroundColor: "transparent" }}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      onClose={props.onClose}
    >
      <View className="flex-1 overflow-hidden rounded-t-2xl">
        <LinearGradient
          colors={["#05251C", "#0E6149"]}
          style={{ paddingBottom: 4 }}
        >
          <Text className="py-1 text-center  text-2xl font-pText text-white">
            Workout day
          </Text>
        </LinearGradient>

        <BottomSheetFlatList
          data={allUniqueExercises}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerClassName="bg-primary pt-1.5 pb-2"
          style={{ backgroundColor: "#131313" }}
        />
      </View>
    </BottomSheet>
  );
});

CalendarBottomSheet.displayName = "CalendarBottomSheet";

export default CalendarBottomSheet;