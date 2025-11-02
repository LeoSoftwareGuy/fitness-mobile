import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function todaysWorkoutLayout() {
    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "fade",
                }}
            >
                <Stack.Screen name="todays-workout" />
            </Stack>
            <StatusBar backgroundColor="#00000" style="dark" />
        </>
    );
};
