
import FitButton from "@/components/buttons/fit-button";
import useAuthStore from "@/hooks/use-auth-store";
import { useTrainingStore } from "@/hooks/use-trainings-store";
import { MuscleGroupExerciseDTO, TrainingSetCommandDTO, Weight } from "@/state/endpoints/api.schemas";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { Alert, Image, Text, TouchableOpacity } from "react-native";
import ExerciseInfoPicker from "./exercise-information-picker";
import ExerciseStatistics from "./exercise-statistics";

interface Props {
    exercise: MuscleGroupExerciseDTO;
    onClose: () => void;
}
export interface ExerciseParameters {
    ExerciseId: string;
    Reps: number;
    Weight: Weight;
    Sets: number;
}
type Ref = BottomSheet;

const ExerciseBottomSheetComponent = forwardRef<Ref, Props>(
    (props, ref) => {
        const [repsSetsWeight, setRepsSetsWeight] = useState<ExerciseParameters>({
            ExerciseId: props.exercise.id,
            Reps: 1,
            Sets: 1,
            Weight: { value: 0, unit: "kg" },
        });

        const addExerciseSets = useTrainingStore((state) => state.addExerciseSets);
        const initializeTraining = useTrainingStore((state) => state.initializeTraining);
        const currentTraining = useTrainingStore((state) => state.currentTraining);
        const user = useAuthStore((state) => state.user);

        const [isLoading, setIsLoading] = useState(false);

        const onAddWorkoutToLocalStorage = useCallback(() => {
            if (!user?.id) {
                Alert.alert("Error", "User not authenticated");
                return;
            }

            setIsLoading(true);

            try {
                if (!currentTraining || currentTraining.userId !== user.id) {
                    initializeTraining(user.id);
                }

                const exerciseSets: TrainingSetCommandDTO[] = Array.from(
                    { length: repsSetsWeight.Sets },
                    () => ({
                        reps: repsSetsWeight.Reps,
                        weight: repsSetsWeight.Weight,
                        exerciseId: repsSetsWeight.ExerciseId,
                    })
                );

                addExerciseSets(exerciseSets, props.exercise.name);

                Alert.alert("Success", "Exercise added to workout!");

                setRepsSetsWeight({
                    ExerciseId: props.exercise.id,
                    Reps: 1,
                    Sets: 1,
                    Weight: { value: 0, unit: "kg" },
                });

                props.onClose();
            } catch (error) {
                Alert.alert("Error", "Failed to save exercise");
                console.error("Failed to add exercise:", error);
            } finally {
                setIsLoading(false);
            }
        }, [repsSetsWeight, props.exercise, addExerciseSets, currentTraining, initializeTraining, user, props.onClose]);

        const handleParametersChange = (
            updatedParameters: Partial<ExerciseParameters>
        ) => {
            setRepsSetsWeight((prev) => ({ ...prev, ...updatedParameters }));
        };

        const snapPoints = useMemo(() => ["40%", "90%", "80%"], []);
        const renderBackdrop = useCallback(
            (props: any) => (
                <BottomSheetBackdrop
                    appearsOnIndex={1}
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
                handleIndicatorStyle={{ backgroundColor: "transparent" }}
                backgroundStyle={{ backgroundColor: "transparent" }}
                backdropComponent={renderBackdrop}
            >
                <BottomSheetView className="bg-[#2C2C2C] flex-1">
                    <BottomSheetView className="px-1.6 py-0.8 w-full h-full">
                        <Image
                            className="w-full h-[180px]"
                            source={{ uri: props.exercise.imageUrl }}
                            resizeMode="contain"
                        />
                        <Text className="mt-[15px] mb-[8px] font-pText text-white text-[24px]">
                            {props.exercise.name}
                        </Text>

                        <BottomSheetView className="mb-4">
                            <ExerciseStatistics
                                exerciseId={props.exercise.id}
                                resultType="best"
                            />
                            <ExerciseStatistics
                                exerciseId={props.exercise.id}
                                resultType="latest"
                            />
                        </BottomSheetView>

                        <ExerciseInfoPicker
                            parameters={repsSetsWeight}
                            onChange={handleParametersChange}
                        />

                        <BottomSheetView className="mt-2 flex-row justify-between items-center">
                            <TouchableOpacity
                                onPress={props.onClose}
                                className="rounded-lg bg-transparent border border-gray"
                                disabled={isLoading}
                            >
                                <Text className="py-[13px] px-[38px] text-center text-white text-[16px] font-pText">
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <FitButton
                                title={"Add to workout"}
                                isLoading={isLoading}
                                buttonStyles={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 38,
                                    borderRadius: 8,
                                }}
                                containerStyles="ml-[22px]"
                                handlePress={onAddWorkoutToLocalStorage}
                            />
                        </BottomSheetView>
                    </BottomSheetView>
                </BottomSheetView>
            </BottomSheet>
        );
    }
);

export default ExerciseBottomSheetComponent;