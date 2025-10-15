import { icons, images } from "@/constants";
import useAuthStore from "@/hooks/use-auth-store";
import { useTrainingStore } from "@/hooks/use-trainings-store";
import { MuscleGroupType } from "@/state/endpoints/api.schemas";
import { useFindMuscleGroups } from "@/state/endpoints/muscle-groups";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateSlider from "./components/date-slider";
import MuscleFlatListComponent from "./components/muscles-flat-list";

export default function HomeScreen() {
    const { data: muscleGroups, isLoading } = useFindMuscleGroups();
    const initializeTraining = useTrainingStore((state) => state.initializeTraining);
    const user = useAuthStore((state) => state.user);

    // maybe not needed , lets see in future
    useEffect(() => {
        if (user?.id) {
            initializeTraining(user.id);
        }
    }, [user?.id, initializeTraining]);

    return (
        <ImageBackground source={images.logo} className="flex-1 my-0 py-0 px-2.5">
            <SafeAreaView edges={["left", "right"]}>
                <ScrollView className="my-0 w-full">
                    <View className="px-2 w-full flex-row justify-between items-center">
                        <TouchableOpacity onPress={() => router.push("/(calendar)/calendar")}>
                            <Image
                                source={icons.calendar}
                                resizeMode="contain"
                                className="mt-5 mx-auto"
                            />
                        </TouchableOpacity>
                        <View className="flex-row items-center space-x-1">
                            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                                <Image
                                    source={icons.dumbel}
                                    resizeMode="contain"
                                    className="mt-5 mx-auto"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                                <Image
                                    source={icons.bio}
                                    resizeMode="contain"
                                    className="mt-5 mx-auto"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <DateSlider />

                    {isLoading ? (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-white text-center">Loading muscle groups...</Text>
                        </View>
                    ) : muscleGroups?.totalItemCount === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-white text-center">No muscle groups available.</Text>
                        </View>
                    ) : (
                        <>
                            <MuscleFlatListComponent
                                muscleGroups={muscleGroups?.items.filter(mg => mg.type === MuscleGroupType.NUMBER_1)}
                                title="Upper"
                            />
                            <MuscleFlatListComponent
                                muscleGroups={muscleGroups?.items.filter(mg => mg.type === MuscleGroupType.NUMBER_2)}
                                title="Lower"
                            />
                            <MuscleFlatListComponent
                                muscleGroups={muscleGroups?.items.filter(mg => mg.type === MuscleGroupType.NUMBER_3)}
                                title="Cardio"
                            />
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};