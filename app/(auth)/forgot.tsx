import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FitButton from "@/components/buttons/fit-button";
import FormField from "@/components/forms/form-field";
import { router } from "expo-router";


export default function ForgotScreen() {
  const [email, setEmail] = useState("");
  return (
    <LinearGradient
      colors={["#3F3F3F", "#151515"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0, 0.35]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View style={styles.headerWrapper}>
            <Text className="mt-[218px] text-emerald font-pText text-4xl font-normal">
              Forgot password!
            </Text>

            <FormField
              title="Email"
              value={email}
              handleChangeText={(e: string) => setEmail(e)}
              otherStyles="mt-[56px]"
              keyboardType="email-address"
              placehorder="Email"
            />

            <FitButton
              title="Send link"
              handlePress={() => {
                router.push("/(auth)/sign-in");
              }}
              containerStyles="w-full mt-[80px]"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    marginVertical: 0,
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
});

