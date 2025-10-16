import FitButton from "@/components/buttons/fit-button";
import FormField from "@/components/forms/form-field";
import useAuthStore from "@/hooks/use-auth-store";
import { RegisterUserResponse } from "@/state/endpoints/api.schemas";
import { useRegisterUser } from "@/state/endpoints/auth";
import axios from "axios"; // Add this import
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

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpScreen() {
  const authStore = useAuthStore((s) => s.setAccessToken);
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  // Add test function
  const testDirectCall = async () => {
    try {
      console.log('🧪 Testing direct API call...');
      const response = await axios.post(
        'http://192.168.1.165:7081/api/auth/register',
        {
          email: 'test@test.com',
          password: 'Test123!',
          confirmPassword: 'Test123!',
          name: 'Test User'
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );
      console.log('✅ Direct call SUCCESS:', response.status, response.data);
      Alert.alert("Success", "Direct API call worked!");
    } catch (error: any) {
      console.error('❌ Direct call FAILED');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Response status:', error.response?.status);
      console.error('Response data:', error.response?.data);
      console.error('Request URL:', error.config?.url);
      Alert.alert("Error", `Direct call failed: ${error.message}`);
    }
  };

  const { mutateAsync, isPending } = useRegisterUser({
    mutation: {
      onSuccess: (data) => {
        console.log('✅ Registration success:', data);
        const response = data as RegisterUserResponse;
        authStore(response.accessToken);
        setForm({ email: "", password: "", confirmPassword: "", name: "" });
      },
      onError: (error: any) => {
        console.error('❌ Registration error:', error);
        console.error('Error message:', error.message);
        console.error('Error response:', error.response);
        console.error('Error config:', error.config);
        Alert.alert("Error", error.message || "Account creation failed");
      }
    },
  });

  const handleOnSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    console.log('🚀 Submitting registration...', { email: form.email, name: form.name });
    await mutateAsync({ data: form });
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
            <Text className="mt-[160px] text-emerald font-pText text-4xl font-normal">
              Create account
            </Text>

            {/* Add test button */}
            <TouchableOpacity
              onPress={testDirectCall}
              style={{ backgroundColor: '#FFA500', padding: 10, borderRadius: 5, marginTop: 20 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>
                Test Direct API Call
              </Text>
            </TouchableOpacity>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e: string) => setForm({ ...form, email: e })}
              otherStyles="mt-[36px]"
              keyboardType="email-address"
              placehorder="Email"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e: string) =>
                setForm({ ...form, password: e })
              }
              otherStyles="mt-[16px]"
              keyboardType="email-password"
              placehorder="Password"
            />

            <FormField
              title="Confirm password"
              value={form.confirmPassword}
              handleChangeText={(e: string) =>
                setForm({ ...form, confirmPassword: e })
              }
              otherStyles="mt-[16px]"
              keyboardType="email-password"
              placehorder="Confirm password"
            />

            <FormField
              title="Name"
              value={form.name}
              handleChangeText={(e: string) => setForm({ ...form, name: e })}
              otherStyles="mt-[16px]"
              keyboardType=""
              placehorder="Name"
            />

            <FitButton
              title="Register"
              handlePress={handleOnSubmit}
              containerStyles="w-full mt-[48px]"
              isLoading={isPending}
            />

            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="pt-[130px] font-pRegular text-[16px] text-darkGray">
                Already have an account?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
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