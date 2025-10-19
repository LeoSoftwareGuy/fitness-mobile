import FitButton from "@/components/buttons/fit-button";
import FormField from "@/components/forms/form-field";
import { Gender, Weight } from "@/state/endpoints/api.schemas";
import { useGetUsersBioInfo, useUpdateUserBio } from "@/state/endpoints/auth";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AgeSelect from "./components/age-select";
import CountrySelect, { CountrySelectValue } from "./components/country-select";
import GenderSelect from "./components/gender-select";
import HeightWeightInput from "./components/height-weight-input";

interface FormState {
    firstName: string;
    lastName: string;
    nationality: string | null;
    age: number;
    gender: Gender;
    height?: number;
    weight?: Weight;
    profileImageUrl?: string;
}

export default function ProfileScreen() {
    const { user, isLoaded } = useUser();
    const { isSignedIn } = useAuth();
    const [isLoadingData, setIsLoadingData] = useState(true);

    const { data: savedUserInfo, isLoading } = useGetUsersBioInfo({
        query: {
            enabled: isSignedIn && isLoaded,
        }
    });

    const [form, setForm] = useState<FormState>({
        firstName: "",
        lastName: "",
        nationality: null,
        age: 18,
        gender: Gender.NUMBER_2,
        height: 170,
        weight: { value: 0, unit: "kg" },
    });

    const { signOut } = useAuth();

    useEffect(() => {
        if (isLoaded && user) {
            loadUserData();
        }
    }, [isLoaded, user, savedUserInfo]);

    const loadUserData = async () => {
        try {
            const firstName = user?.firstName || "";
            const lastName = user?.lastName || "";
            const profileImageUrl = user?.imageUrl;

            setForm({
                firstName,
                lastName,
                nationality: savedUserInfo?.nationality || null,
                age: savedUserInfo?.age || 18,
                gender: savedUserInfo?.gender || Gender.NUMBER_2,
                height: savedUserInfo?.height || 170,
                weight: savedUserInfo?.weight || { value: 0, unit: "kg" },
                profileImageUrl,
            });
        } catch (error) {
            console.error("Error loading user data:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    const { mutateAsync, isPending } = useUpdateUserBio({
        mutation: {
            onSuccess: () => {
                Alert.alert("Success", "Profile updated successfully!");
            },
            onError: (error: any) => {
                Alert.alert("Error", error?.message || "Failed to update profile");
            }
        }
    });

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission Required", "Please grant camera roll permissions");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const imageUri = result.assets[0].uri;

            try {
                const response = await fetch(imageUri);
                const blob = await response.blob();

                await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        try {
                            const base64data = reader.result as string;
                            await user?.setProfileImage({ file: base64data });

                            setForm(prev => ({ ...prev, profileImageUrl: imageUri }));
                            Alert.alert("Success", "Profile picture updated!");
                            resolve(true);
                        } catch (error) {
                            reject(error);
                        }
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                Alert.alert("Error", "Failed to upload profile picture");
            }
        }
    };

    const handleOnSubmit = async () => {
        if (!user) {
            Alert.alert("Error", "User not authenticated");
            return;
        }

        if (!form.firstName || !form.lastName || !form.nationality || !form.age || !form.height || !form.weight?.value) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            await user.update({
                firstName: form.firstName,
                lastName: form.lastName,
            });

            await mutateAsync({
                data: {
                    clerkUserId: user.id,
                    email: user.primaryEmailAddress?.emailAddress || "",
                    nationality: form.nationality,
                    age: form.age,
                    gender: form.gender,
                    height: form.height,
                    weight: form.weight,
                }
            });

            await user.update({
                unsafeMetadata: {
                    hasCompletedProfile: true,
                    nationality: form.nationality,
                    age: form.age,
                    gender: form.gender,
                    height: form.height,
                    weight: form.weight,
                }
            });

        } catch (error: any) {
            Alert.alert("Error", error.message || "Something went wrong");
        }
    };

    const handleLogout = async () => {
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

    if (!isLoaded || isLoadingData || isLoading) {
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
            className="flex-1"
        >
            <SafeAreaView className="flex-1">
                <ScrollView contentContainerClassName="pb-10">
                    <View className="my-0 items-center py-0 px-2.5">
                        {/* Header */}
                        <View className="w-full flex-row justify-between items-center mt-4 mb-8 px-4">
                            <TouchableOpacity onPress={() => router.back()}>
                                <Text className="text-white text-base">← Back</Text>
                            </TouchableOpacity>
                            <Text className="text-emerald font-pText text-2xl">Profile</Text>
                            <View className="w-12" />
                        </View>

                        {/* Profile Picture */}
                        <TouchableOpacity
                            onPress={pickImage}
                            className="mb-6 w-32 h-32 rounded-full bg-gray-700 justify-center items-center border-2 border-emerald overflow-hidden"
                        >
                            {form.profileImageUrl ? (
                                <Image
                                    source={{ uri: form.profileImageUrl }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                            ) : (
                                <View className="items-center">
                                    <Text className="text-4xl text-gray-400 mb-2">📷</Text>
                                    <Text className="text-xs text-gray-400">Add Photo</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={pickImage} className="mb-8">
                            <Text className="text-emerald text-sm">Change profile picture</Text>
                        </TouchableOpacity>

                        {/* User Info Section */}
                        <View className="w-full bg-gray-800 rounded-lg p-4 mb-6">
                            <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
                                <Text className="text-gray-400">Name</Text>
                                <Text className="text-white font-pMedium">
                                    {form.firstName} {form.lastName}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
                                <Text className="text-gray-400">Email</Text>
                                <Text className="text-white">{user?.primaryEmailAddress?.emailAddress}</Text>
                            </View>
                            <TouchableOpacity
                                className="flex-row justify-between items-center py-3"
                                onPress={() => {
                                    router.push("/(auth)/forgot");
                                }}
                            >
                                <Text className="text-gray-400">Password</Text>
                                <Text className="text-emerald">Reset →</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Edit Profile Section */}
                        <Text className="text-white text-xl font-pText mb-4 self-start">
                            Edit Profile Information
                        </Text>

                        <View className="w-full">
                            <FormField
                                title="First Name"
                                value={form.firstName}
                                handleChangeText={(e: string) =>
                                    setForm({ ...form, firstName: e })
                                }
                                otherStyles="mb-4"
                                placehorder="First Name"
                            />

                            <FormField
                                title="Last Name"
                                value={form.lastName}
                                handleChangeText={(e: string) =>
                                    setForm({ ...form, lastName: e })
                                }
                                otherStyles="mb-4"
                                placehorder="Last Name"
                            />

                            <CountrySelect
                                onChange={(e: CountrySelectValue) =>
                                    setForm({ ...form, nationality: e.value })
                                }
                                value={form.nationality ? {
                                    value: form.nationality,
                                    label: '',
                                    flag: '',
                                    latlng: [],
                                    region: ''
                                } : null}
                            />

                            <AgeSelect
                                age={form.age.toString()}
                                onAgeChange={(e: string) =>
                                    setForm({ ...form, age: parseInt(e) || 18 })
                                }
                            />

                            <GenderSelect
                                selectedGender={form.gender}
                                onGenderChange={(e: Gender) => setForm({ ...form, gender: e })}
                            />

                            <HeightWeightInput
                                height={form.height}
                                weight={form.weight}
                                onHeightChange={(height: number) => setForm({ ...form, height })}
                                onWeightChange={(weight: Weight) => setForm({ ...form, weight })}
                            />
                        </View>

                        <FitButton
                            title="Save Changes"
                            handlePress={handleOnSubmit}
                            isLoading={isPending}
                            containerStyles="w-full mt-[40px]"
                        />

                        <TouchableOpacity
                            onPress={handleLogout}
                            className="mt-8 mb-4"
                        >
                            <Text className="text-red-500 text-base">Log out?</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}