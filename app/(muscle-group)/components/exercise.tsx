import { MuscleGroupExerciseDTO } from "@/state/endpoints/api.schemas";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

interface ExerciseComponentProps {
    exercise: MuscleGroupExerciseDTO;
    onClick: () => void;
}

export default function ExerciseComponent({ exercise, onClick }: ExerciseComponentProps) {
    return (
        <TouchableOpacity onPress={onClick} className="mb-4 w-3/6 h-[125px]">
            <Image
                className="w-full h-[88px]"
                source={{ uri: exercise.imageUrl }}
                resizeMode="contain"
            />
            <Text className="pl-[5px] pt-2 pb-2 font-pText text-[16px] text-white">
                {exercise.name}
            </Text>
        </TouchableOpacity>
    );
};