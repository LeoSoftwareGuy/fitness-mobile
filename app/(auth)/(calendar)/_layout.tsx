import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const CalendarLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="calendar" />
      </Stack>
      <StatusBar backgroundColor="#00000" style="dark" />
    </>
  );
};

export default CalendarLayout;
