import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const ProfileLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="profile"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
            <StatusBar backgroundColor="#00000" style="dark" />
        </>
    );
};

export default ProfileLayout;
