import icons from '@/constants/icons';
import images from '@/constants/images';
import { router } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PerformanceStatistics from './_components/performance-statistics';

export default function StatisticsScreen() {
    return (
        <ImageBackground source={images.logo} className="my-0 py-0 px-2.5 flex-1">
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
                        <View className="flex-row items-center justify-between gap-1">
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
                </ScrollView>
            </SafeAreaView>

            <Text className="my-2 text-center font-pText text-xl text-white">
                Analyze your workout
            </Text>
            <PerformanceStatistics />
        </ImageBackground>
    );
}