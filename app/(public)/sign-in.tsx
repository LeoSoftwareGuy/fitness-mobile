
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FitButton from "@/components/buttons/fit-button";
import FormField from "@/components/forms/form-field";
import { useSignIn } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password
      });

      await setActive({ session: completeSignIn.createdSessionId });
    } catch (error: any) {
      Alert.alert(error.errors[0].message);
    }
    finally {
      setLoading(false);
    }
  }
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
              value={emailAddress}
              handleChangeText={(e: string) => setEmailAddress(e)}
              otherStyles="mt-[56px]"
              keyboardType="email-address"
              placehorder="Email"
            />

            <FormField
              title="Password"
              value={password}
              handleChangeText={(e: string) => setPassword(e)}
              otherStyles="mt-[16px]"
              keyboardType="default"
              placehorder="Password"
            />

            <TouchableOpacity onPress={() => router.push("/(public)/forgot")}>
              <View className="flex-row w-full justify-end">
                <Text className="pt-2 font-pRegular text-[14px] text-darkGray">
                  Forgot password?
                </Text>
              </View>
            </TouchableOpacity>

            <FitButton
              title="Sign in"
              handlePress={onSignInPress}
              isLoading={loading}
              containerStyles="w-full mt-[80px]"
            />

            <TouchableOpacity onPress={() => router.push("/(public)/register")}>
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