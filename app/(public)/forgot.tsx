import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FitButton from "@/components/buttons/fit-button";
import FormField from "@/components/forms/form-field";
import { useSignIn } from "@clerk/clerk-expo";


export default function ForgotScreen() {
  const { signIn, setActive } = useSignIn();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);

  const onRequestReset = async () => {
    try {
      await signIn?.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress
      });

      setSuccessfulCreation(true);
    } catch (error: any) {
      Alert.alert(error.errors[0].message);
    }
  }

  const onReset = async () => {
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password
      });

      Alert.alert('Password was reset successfuly');

      await setActive!({ session: result?.createdSessionId })
    } catch (error: any) {
      Alert.alert(error.errors[0].message);
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
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View style={styles.headerWrapper}>
            <Text className="mt-[218px] text-emerald font-pText text-4xl font-normal">
              Forgot password!
            </Text>

            {!successfulCreation && (
              <>
                <FormField
                  title="Email"
                  value={emailAddress}
                  handleChangeText={(e: string) => setEmailAddress(e)}
                  otherStyles="mt-[56px]"
                  keyboardType="email-address"
                  placehorder="Email"
                />

                <FitButton
                  title="Send email"
                  handlePress={onRequestReset}
                  containerStyles="w-full mt-[80px]"
                />
              </>
            )}

            {successfulCreation && (
              <>
                <FormField
                  title="Code"
                  value={code}
                  handleChangeText={(e: string) => setCode(e)}
                  otherStyles="mt-[56px]"
                  placehorder="Code..."
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
                  title="Send new password"
                  handlePress={onReset}
                  containerStyles="w-full mt-[80px]"
                />
              </>
            )}
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

