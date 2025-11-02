import FitButton from "@/components/buttons/fit-button";
import { useTrainingStore } from "@/hooks/use-trainings-store";
import { MuscleGroupExerciseDTO, MuscleGroupType, TrainingSetCommandDTO, Weight } from "@/state/endpoints/api.schemas";
import { useUser } from "@clerk/clerk-expo";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import ExerciseInfoPicker from "./exercise-information-picker";
import ExerciseStatistics from "./exercise-statistics";

interface Props {
    exercise: MuscleGroupExerciseDTO;
    muscleGroupType: MuscleGroupType;
    onClose: () => void;
}
export interface ExerciseParameters {
    ExerciseId: string;
    MuscleGroupType: MuscleGroupType;
    Sets: number;
    Reps?: number;
    Weight?: Weight;
    Pace?: number;
    Duration?: number;
    Elevation?: number;
}
type Ref = BottomSheet;

const createDefaultParameters = (
    exerciseId: string,
    muscleGroupType: MuscleGroupType
): ExerciseParameters => {
    if (muscleGroupType === MuscleGroupType.NUMBER_3) {
        return {
            ExerciseId: exerciseId,
            MuscleGroupType: muscleGroupType,
            Sets: 1,
            Pace: 8,
            Duration: 30,
            Elevation: 0
        };
    }

    return {
        ExerciseId: exerciseId,
        MuscleGroupType: muscleGroupType,
        Sets: 1,
        Reps: 10,
        Weight: { value: 0, unit: "bodyweight" }
    };
};

const ExerciseBottomSheetComponent = forwardRef<Ref, Props>(
    (props, ref) => {
        const [repsSetsWeight, setRepsSetsWeight] = useState<ExerciseParameters>(
            createDefaultParameters(props.exercise.id, props.muscleGroupType)
        );

        useEffect(() => {
            setRepsSetsWeight(createDefaultParameters(props.exercise.id, props.muscleGroupType));
        }, [props.exercise.id, props.muscleGroupType]);

        const addExerciseSets = useTrainingStore((state) => state.addExerciseSets);
        const initializeTraining = useTrainingStore((state) => state.initializeTraining);
        const currentTraining = useTrainingStore((state) => state.currentTraining);
        const { user } = useUser();
        const [isLoading, setIsLoading] = useState(false);
        const isCardio = repsSetsWeight.MuscleGroupType === MuscleGroupType.NUMBER_3;

        const onAddWorkoutToLocalStorage = useCallback(() => {
            if (!user?.id) {
                Alert.alert("Error", "User not authenticated");
                return;
            }

            if (isCardio) {
                if (!repsSetsWeight.Pace || repsSetsWeight.Pace <= 0) {
                    Alert.alert("Missing pace", "Please provide a pace greater than 0.");
                    return;
                }
                if (!repsSetsWeight.Duration || repsSetsWeight.Duration <= 0) {
                    Alert.alert("Missing duration", "Please provide a duration greater than 0.");
                    return;
                }
                if (repsSetsWeight.Elevation === undefined || repsSetsWeight.Elevation < 0) {
                    Alert.alert("Missing elevation", "Please provide a non-negative elevation.");
                    return;
                }
            } else {
                if (!repsSetsWeight.Reps || repsSetsWeight.Reps <= 0) {
                    Alert.alert("Missing reps", "Please provide repetitions greater than 0.");
                    return;
                }
                if (!repsSetsWeight.Weight) {
                    Alert.alert("Missing weight", "Please select a weight value.");
                    return;
                }
            }

            setIsLoading(true);

            try {
                if (!currentTraining || currentTraining.userId !== user.id) {
                    initializeTraining(user.id);
                }

                const exerciseSets: TrainingSetCommandDTO[] = Array.from(
                    { length: repsSetsWeight.Sets },
                    () => {
                        const durationSeconds = isCardio && repsSetsWeight.Duration
                            ? Math.round(repsSetsWeight.Duration * 60)
                            : undefined;

                        return {
                            exerciseId: repsSetsWeight.ExerciseId,
                            muscleGroupType: repsSetsWeight.MuscleGroupType,
                            reps: isCardio ? undefined : repsSetsWeight.Reps,
                            weight: isCardio ? undefined : repsSetsWeight.Weight,
                            pace: isCardio ? repsSetsWeight.Pace : undefined,
                            duration: durationSeconds,
                            elevation: isCardio ? repsSetsWeight.Elevation : undefined
                        };
                    }
                );

                addExerciseSets(exerciseSets, props.exercise.name);

                Alert.alert("Success", "Exercise added to workout!");

                setRepsSetsWeight(createDefaultParameters(props.exercise.id, props.muscleGroupType));

                props.onClose();
            } catch (error) {
                Alert.alert("Error", "Failed to save exercise");
                console.error("Failed to add exercise:", error);
            } finally {
                setIsLoading(false);
            }
        }, [
            repsSetsWeight,
            props.exercise,
            props.muscleGroupType,
            addExerciseSets,
            currentTraining,
            initializeTraining,
            user,
            props.onClose,
            isCardio
        ]);

        const handleParametersChange = (
            updatedParameters: Partial<ExerciseParameters>
        ) => {
            setRepsSetsWeight((prev) => ({ ...prev, ...updatedParameters }));
        };

        const snapPoints = useMemo(() => ["20%", "60%"], []);
        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    {...props}
                />
            ),
            []
        );

        return (
            <BottomSheet
                ref={ref}
                index={-1}
                snapPoints={snapPoints}
                handleIndicatorStyle={{ backgroundColor: "#666666", width: 40, height: 4 }}
                backgroundStyle={{ backgroundColor: "#2C2C2C" }}
                backdropComponent={renderBackdrop}
                enablePanDownToClose={true}
            >
                <BottomSheetView className="flex-1 bg-[#2C2C2C] px-1.6 pt-0.8 pb-2.4">
                    <Image
                        className="w-full h-[180px] mb-1.2"
                        source={{ uri: props.exercise.imageUrl }}
                        resizeMode="contain"
                    />
                    <Text className="text-2xl font-pText text-white mb-1.2 text-center">
                        {props.exercise.name}
                    </Text>

                    <ExerciseStatistics
                        exerciseId={props.exercise.id}
                        resultType="latest"
                    />
                    <ExerciseStatistics
                        exerciseId={props.exercise.id}
                        resultType="best"
                    />

                    <ExerciseInfoPicker
                        parameters={repsSetsWeight}
                        onChange={handleParametersChange}
                    />

                    <View className="flex-row justify-between items-center mt-2 gap-1.2">
                        <TouchableOpacity
                            onPress={props.onClose}
                            className="flex-1 py-[13px] rounded-lg bg-transparent border border-gray"
                            disabled={isLoading}
                        >
                            <Text className="text-center text-white text-lg font-pRegular">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <FitButton
                            title="Add to workout"
                            isLoading={isLoading}
                            containerStyles="flex-1"
                            buttonStyles={{
                                paddingVertical: 13,
                                paddingHorizontal: 0,
                                borderRadius: 8,
                                width: '100%',
                            }}
                            handlePress={onAddWorkoutToLocalStorage}
                        />
                    </View>
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

export default ExerciseBottomSheetComponent;
