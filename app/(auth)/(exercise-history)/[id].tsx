import { icons, images } from "@/constants";
import { ExerciseSetsByDate } from "@/state/endpoints/api.schemas";
import { useGetExerciseHistory } from "@/state/endpoints/statistics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    ListRenderItem,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExerciseSetsByDateComponent from "./components/exercise-sets-by-date";
import TimePeriodSelector from "./components/time-period-selector";

export type TimePeriod = "week" | "month" | "3months";

export default function ExerciseHistoryScreen() {
    const params = useLocalSearchParams<{ id?: string | string[] }>();

    const exerciseId = useMemo(() => {
        const raw = params?.id;
        if (Array.isArray(raw)) return raw[0];
        return raw ?? undefined;
    }, [params]);

    const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");

    const {
        data: exerciseHistory,
        isLoading,
        error,
    } = useGetExerciseHistory(exerciseId as string, {
        exerciseId: exerciseId!,
        timeInterval: timePeriod,
    });

    const renderExerciseSet: ListRenderItem<ExerciseSetsByDate> = ({ item }) => (
        <ExerciseSetsByDateComponent
            date={item.date}
            setsInfo={item.setsInfo ?? []}
        />
    );

    if (!exerciseId) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#fff" />
                <Text className="mt-0.5 text-white">Preparing Exercise History…</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#fff" />
                <Text className="mt-0.5 text-white">Loading Exercise History...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <Text className="text-red-500 text-base">Failed to load exercise data.</Text>
            </View>
        );
    }

    const timePeriodLabel = {
        week: "Last Week",
        month: "Last Month",
        "3months": "Last 3 Months",
    }[timePeriod];

    const hasHistory = exerciseHistory?.sets && exerciseHistory.sets.length > 0;

    return (
        <ImageBackground source={images.logo} className="flex-1 px-1">
            <SafeAreaView className="flex-1">
                <View className="px-2 pt-1.5">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Image
                            source={icons.cross}
                            resizeMode="contain"
                            tintColor="#2AB38E"
                            className="mx-2 mb-2"
                        />
                    </TouchableOpacity>
                </View>

                <Text className="text-center font-pText text-xl text-white">
                    {exerciseHistory?.exerciseName || "Exercise Stats"}
                </Text>

                {exerciseHistory?.exerciseImageUrl ? (
                    <View className="bg-white rounded-lg overflow-hidden my-2">
                        <Image
                            source={{ uri: exerciseHistory.exerciseImageUrl }}
                            resizeMode="contain"
                            className="w-full h-20"
                        />
                    </View>
                ) : null}

                <TimePeriodSelector
                    selectedPeriod={timePeriod}
                    onSelectPeriod={setTimePeriod}
                />

                <Text className="mt-4 px-2 font-pText text-lg text-white">
                    {timePeriodLabel}
                </Text>

                {hasHistory ? (
                    <FlatList
                        data={exerciseHistory.sets}
                        renderItem={renderExerciseSet}
                        keyExtractor={(item, index) => `${item.date}-${index}`}
                        contentContainerClassName="py-2"
                        showsVerticalScrollIndicator={false}
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-center text-lg font-pRegular text-gray">
                            No exercise history found for this period
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        </ImageBackground>
    );
}