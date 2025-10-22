import FitButton from "@/components/buttons/fit-button";
import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileFormFields from "./components/profile-form-fields";
import ProfileHeader from "./components/profile-header";
import ProfilePicture from "./components/profile-picture";
import UserInfoSection from "./components/use-info-section";
import { useProfileForm } from "./hooks/use-profile-form";
import { useProfileImage } from "./hooks/use-profile-image";

export default function ProfileScreen() {
    const { signOut } = useAuth();
    const { form, updateForm, handleSubmit, isLoading, isSaving, user } = useProfileForm();
    const { pickImage } = useProfileImage((imageUri) => updateForm({ profileImageUrl: imageUri }));

    const handleLogout = () => {
        Alert.alert(
            "Log Out",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Log Out",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace("/");
                    }
                }
            ]
        );
    };

    if (isLoading) {
        return (
            <LinearGradient
                colors={["#3F3F3F", "#151515"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                locations={[0, 0.35]}
                className="flex-1"
            >
                <SafeAreaView className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text className="text-white mt-4">Loading profile...</Text>
                </SafeAreaView>
            </LinearGradient>
        );
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
                <ScrollView contentContainerClassName="pb-10">
                    <View className="px-2 items-center ">
                        <ProfileHeader />

                        <ProfilePicture
                            imageUrl={form.profileImageUrl}
                            onPress={pickImage}
                        />

                        <UserInfoSection email={user?.primaryEmailAddress?.emailAddress || ""} />

                        <ProfileFormFields
                            firstName={form.firstName}
                            lastName={form.lastName}
                            nationality={form.nationality}
                            age={form.age}
                            gender={form.gender}
                            height={form.height}
                            weight={form.weight}
                            onUpdate={updateForm}
                        />

                        <FitButton
                            title="Save Changes"
                            handlePress={handleSubmit}
                            isLoading={isSaving}
                            containerStyles="w-full mt-[40px]"
                        />

                        <TouchableOpacity onPress={handleLogout} className="mt-8 mb-4">
                            <Text className="text-red-500 text-base">Log out?</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}