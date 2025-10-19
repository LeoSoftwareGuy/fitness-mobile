import FitButton from "@/components/buttons/fit-button";
import FormField from "@/components/forms/form-field";

import { useSignUp } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      setPendingVerification(true);

    } catch (error: any) {
      Alert.alert(error.errors[0].message);
    }
    finally {
      setLoading(false);
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };


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

            {!pendingVerification && (
              <>
                <Text className="mt-[160px] text-emerald font-pText text-4xl font-normal">
                  Create account
                </Text>

                <FormField
                  title="Email"
                  value={emailAddress}
                  handleChangeText={(e: string) => setEmailAddress(e)}
                  otherStyles="mt-[36px]"
                  keyboardType="email-address"
                  placehorder="Email"
                />

                <FormField
                  title="Password"
                  value={password}
                  handleChangeText={(e: string) => setPassword(e)}
                  otherStyles="mt-[16px]"
                  keyboardType="email-password"
                  placehorder="Password"
                />

                <FitButton
                  title="Register"
                  handlePress={onSignUpPress}
                  containerStyles="w-full mt-[48px]"
                  isLoading={loading}
                />

                <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                  <Text className="pt-[130px] font-pRegular text-[16px] text-darkGray">
                    Already have an account?
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {pendingVerification && (
              <>
                <FormField
                  title="Code"
                  value={code}
                  handleChangeText={(e: string) => setCode(code)}
                  placehorder="Code..."
                  otherStyles="mt-[36px]"
                />

                <TouchableOpacity onPress={onVerifyPress}>
                  <Text className="pt-[130px] font-pRegular text-[16px] text-darkGray">
                    Verify Email
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient >
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    marginVertical: 0,
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
});