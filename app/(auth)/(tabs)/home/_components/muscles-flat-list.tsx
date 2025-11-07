import { FindMuscleGroupsResponse } from "@/state/endpoints/api.schemas";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React from "react";
import { Text, View } from "react-native";
import MuscleFlatListItem from "./muscles-flat-list-item";

interface MusclesFlatListComponentProps {
    muscleGroups: FindMuscleGroupsResponse[] | undefined;
    title: string;
}

export default function MusclesFlatListComponent({ muscleGroups, title }: MusclesFlatListComponentProps) {
    if (!muscleGroups || muscleGroups.length === 0) {
        return null;
    }

    const renderItem: ListRenderItem<FindMuscleGroupsResponse> = ({ item, index }) => (
        <View className={index < muscleGroups.length - 1 ? "mr-2" : ""}>
            <MuscleFlatListItem muscleGroup={item} />
        </View>
    );

    return (
        <View className="my-1 min-h-[160px]">
            <Text className="mb-1 font-pText text-[16px] text-white">
                {title} body
            </Text>
            <FlashList
                data={muscleGroups}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
}