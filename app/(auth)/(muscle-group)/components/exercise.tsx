import { MuscleGroupExerciseDTO } from "@/state/endpoints/api.schemas";
import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

interface ExerciseComponentProps {
    exercise: MuscleGroupExerciseDTO;
    onClick: () => void;
}

export default function ExerciseComponent({ exercise, onClick }: ExerciseComponentProps) {
    return (
        <TouchableOpacity onPress={onClick} className="my-2 w-full h-[150px]">
            <Image
                className="w-full h-[80px]"
                source={{ uri: exercise.imageUrl }}
                resizeMode="contain"
            />
            <Text className="pl-[5px] pt-2 pb-2 font-pText text-[16px] text-white">
                {exercise.name}
            </Text>
        </TouchableOpacity>
    );
}