import { FindMuscleGroupsResponse } from "@/state/endpoints/api.schemas";
import React from "react";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import MuscleFlatListItem from "./muscles-flat-list-item";

interface MusclesFlatListComponentProps {
    muscleGroups: FindMuscleGroupsResponse[] | undefined;
    title: string;
}

export default function MusclesFlatListComponent({ muscleGroups, title }: MusclesFlatListComponentProps) {
    if (!muscleGroups || muscleGroups.length === 0) {
        return null;
    }
    return (
        <View className="my-1 min-h-[160px]">
            <Text className="mb-1 font-pText text-[16px] text-white">
                {title} body
            </Text>
            <FlatList
                data={muscleGroups}
                renderItem={({ item }) => <MuscleFlatListItem muscleGroup={item} />}
                keyExtractor={(item) => item.id}
                className="py-1"
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};
