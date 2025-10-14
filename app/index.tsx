import FitButton from "@/components/buttons/fit-button";
import { images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from 'react';
import { Image, ScrollView, Text, View, } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

export default function IntroScreen() {
    return (
        <LinearGradient
            colors={["#3F3F3F", "#151515"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            locations={[0, 0.35]}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="flex-1 bg-transparent">
                <ScrollView contentContainerClassName="min-h-full">
                    <View className="my-0 py-0 px-2.5 items-center">
                        <Image
                            source={images.FitTrack}
                            resizeMode="contain"
                            className="mt-50"
                        />
                        <Text className="mt-6 font-pText text-xl font-normal text-white">
                            Track Progress.
                        </Text>
                        <Text className="mb-14 font-pText text-xl font-normal text-white">
                            Crush Goals.
                        </Text>
                        <FitButton
                            title="Get Started"
                            handlePress={() => router.push("/(auth)/sign-in")}
                            containerStyles="w-full"
                        />
                        <Image
                            source={images.zyzz}
                            resizeMode="contain"
                            className="min-h-[400px]"
                        />
                    </View>
                </ScrollView>
                <StatusBar backgroundColor="#000000" style="dark" />
            </SafeAreaView>
        </LinearGradient>
    )
}