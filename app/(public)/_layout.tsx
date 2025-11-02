import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const AuthLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot" />
      </Stack>

      <StatusBar backgroundColor="#00000" style="dark" />
    </>
  );
};

export default AuthLayout;

/* Reason for separate Layout is because this is the only page which
should not have any nav bar or footer
 */
