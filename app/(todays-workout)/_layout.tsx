import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function todaysWorkoutLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="todaysWorkout"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
            <StatusBar backgroundColor="#00000" style="dark" />
        </>
    );
};
