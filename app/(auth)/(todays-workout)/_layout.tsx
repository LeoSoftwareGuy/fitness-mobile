import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function todaysWorkoutLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="todays-workout"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
            <StatusBar backgroundColor="#00000" style="dark" />
        </>
    );
};
