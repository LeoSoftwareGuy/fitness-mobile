import { FindMuscleGroupsResponse } from "@/state/endpoints/api.schemas";
import { router } from "expo-router";
import React from "react";
import { ImageBackground, Text, TouchableOpacity } from "react-native";

interface MusclesFlatListItemProps {
  muscleGroup: FindMuscleGroupsResponse;
}

export default function MusclesFlatListItem({ muscleGroup }: MusclesFlatListItemProps) {
  return (
    <TouchableOpacity
      className={`mr-2 w-[230px] h-[103px]`}
      onPress={() => router.push(`//${muscleGroup.id}`)}
    >
      <ImageBackground
        source={{ uri: muscleGroup.imageUrl }}
        //defaultSource={require('@/assets/images/placeholder.png')} // Local fallback
        resizeMode="cover"
        className="flex-1 justify-center"
      >
        <Text className="font-pText text-[15px] text-white text-center">
          {muscleGroup.name}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};