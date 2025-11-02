import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const ProfileLayout = () => {
    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "fade",
                }}
            >
                <Stack.Screen name="profile" />
            </Stack>
            <StatusBar backgroundColor="#00000" style="dark" />
        </>
    );
};

export default ProfileLayout;
