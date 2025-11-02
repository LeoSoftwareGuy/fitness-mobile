import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const CalendarLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="calendar"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#00000" style="dark" />
    </>
  );
};

export default CalendarLayout;
