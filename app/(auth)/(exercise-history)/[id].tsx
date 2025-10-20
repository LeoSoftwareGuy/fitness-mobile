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

export type TimePeriod = "week" | "month" | "3months" | "year" | "best" | "latest";

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
                <Text className="mt-2.5 text-white">Preparing Exercise History…</Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#fff" />
                <Text className="mt-2.5 text-white">Loading Exercise History...</Text>
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
        year: "Last Year",
        best: "Best Performances",
        latest: "Latest Sessions",
    }[timePeriod];

    const hasHistory = exerciseHistory?.sets && exerciseHistory.sets.length > 0;

    return (
        <ImageBackground source={images.logo} className="my-0 py-0 px-2.5 flex-1">
            <SafeAreaView className="flex-1">
                <View className="py-10 pb-2.5 flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()}>
                        <Image
                            source={icons.leftArrow}
                            resizeMode="contain"
                            className="w-6 h-6"
                            style={{ tintColor: "white" }}
                        />
                    </TouchableOpacity>
                    <Text className="flex-1 text-center font-pText text-xl text-white">
                        {exerciseHistory?.exerciseName || "Exercise Stats"}
                    </Text>
                </View>

                {exerciseHistory?.exerciseImageUrl ? (
                    <Image
                        source={{ uri: exerciseHistory.exerciseImageUrl }}
                        resizeMode="contain"
                        className="my-9 w-full h-48 rounded-lg"
                    />
                ) : null}

                <TimePeriodSelector
                    selectedPeriod={timePeriod}
                    onSelectPeriod={setTimePeriod}
                />

                <Text className="mt-5 font-pText text-xl text-white">
                    {timePeriodLabel}
                </Text>

                {hasHistory ? (
                    <FlatList
                        data={exerciseHistory.sets}
                        renderItem={renderExerciseSet}
                        keyExtractor={(item, index) => `${item.date}-${index}`}
                        contentContainerClassName="py-5"
                    />
                ) : (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-center text-lg text-gray-400">
                            No exercise history found for this period.
                        </Text>
                        <Text className="mt-2 text-center text-sm text-gray-500">
                            Start tracking your workouts to see your progress!
                        </Text>
                    </View>
                )}
            </SafeAreaView>
        </ImageBackground>
    );
}