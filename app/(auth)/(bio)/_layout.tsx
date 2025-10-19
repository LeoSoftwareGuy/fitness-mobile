import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const BioLayout = () => {
    return (
        <>
            <Stack>
                <Stack.Screen
                    name="bio"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
            <StatusBar backgroundColor="#00000" style="dark" />
        </>
    );
};

export default BioLayout;
