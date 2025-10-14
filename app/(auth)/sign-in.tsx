
import useAuthStore from "@/hooks/use-auth-store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import { SecureTokenStorage } from "@/components/biometrics/secure-token-storage";
import FitButton from "@/components/buttons/fit-button";
import FormField from "@/components/forms/form-field";
import { LoginUserResponse } from "@/state/endpoints/api.schemas";
import { useLoginUser } from "@/state/endpoints/auth";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

interface FormState {
  email: string;
  password: string;
}

export default function SignInScreen() {
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

  const { setAccessToken, checkBiometric } = useAuthStore();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (accessToken) {
      router.replace("/(tabs)/home");
    }
  }, [accessToken]);

  const { mutateAsync, isPending } = useLoginUser({
    mutation: {
      onSuccess: async (data) => {
        const response = data as LoginUserResponse;

        await setAccessToken(response.accessToken);

        const biometricAvailable = await SecureTokenStorage.isBiometricAvailable();
        const biometricEnabled = await SecureTokenStorage.isBiometricEnabled();

        if (biometricAvailable && !biometricEnabled) {
          Alert.alert(
            "Enable Biometric Auth?",
            `Would you like to use ${await SecureTokenStorage.getBiometricType()} to unlock FitTrack?`,
            [
              { text: "Not Now", style: "cancel" },
              {
                text: "Enable",
                onPress: async () => {
                  const success = await SecureTokenStorage.authenticateWithBiometric();
                  if (success) {
                    await SecureTokenStorage.enableBiometric();
                    await checkBiometric();
                  }
                },
              },
            ]
          );
        }

        router.replace("/(tabs)/home");
        setForm({ email: "", password: "" });
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message || "Login failed");
      }
    }
  });

  const handleOnSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    await mutateAsync({ data: form });
  };

  return (
    <LinearGradient
      colors={["#3F3F3F", "#151515"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      locations={[0, 0.35]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerClassName="min-h-full">
          <View className="my-0 py-0 px-2.5 items-center">
            <Text className="mt-[218px] text-emerald font-pText text-4xl font-normal">
              Welcome!
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e: string) => setForm({ ...form, email: e })}
              otherStyles="mt-[56px]"
              keyboardType="email-address"
              placehorder="Email"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e: string) => setForm({ ...form, password: e })}
              otherStyles="mt-[16px]"
              keyboardType="default"
              placehorder="Password"
            />

            <TouchableOpacity onPress={() => router.push("/(auth)/forgot")}>
              <View className="flex-row w-full justify-end">
                <Text className="pt-2 font-pRegular text-[14px] text-darkGray">
                  Forgot password?
                </Text>
              </View>
            </TouchableOpacity>

            <FitButton
              title="Sign in"
              handlePress={handleOnSubmit}
              isLoading={isPending}
              containerStyles="w-full mt-[80px]"
            />

            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text className="pt-[130px] font-pRegular text-[16px] text-darkGray">
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}