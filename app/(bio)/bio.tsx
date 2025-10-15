
import FitButton from "@/components/buttons/fit-button";
import { Gender } from "@/state/endpoints/api.schemas";
import { useUpdateUserBio } from "@/state/endpoints/auth";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AgeSelect from "./components/age-select";
import CountrySelect, { CountrySelectValue } from "./components/country-select";
import GenderSelect from "./components/gender-select";
import HeightWeightInput from "./components/height-weight-input";

interface FormState {
    nationality: string | null;
    age: number;
    gender: Gender;
    height?: number;
    weight?: number;
    profileImage?: {
        uri: string;
        name: string;
        type: string;
    };
}

export default function BioScreen() {
    const [form, setForm] = useState<FormState>({
        nationality: null,
        age: 18,
        gender: Gender.NUMBER_2,
        height: 170,
        weight: 70,
    });

    const { mutateAsync, isPending } = useUpdateUserBio({
        mutation: {
            onSuccess: () => {
                Alert.alert("Success", "Profile updated successfully!");
                router.push("/(tabs)/home");
            },
            onError: (error: any) => {
                Alert.alert("Error", error.message || "Update failed");
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
            const imageName = imageUri.split("/").pop() || "profile.jpg";
            const imageType = `image/${imageName.split(".").pop()}`;

            setForm({
                ...form,
                profileImage: {
                    uri: imageUri,
                    name: imageName,
                    type: imageType,
                },
            });
        }
    };

    const handleOnSubmit = async () => {
        if (!form.nationality || !form.age || !form.height || !form.weight) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        const formData = new FormData();
        formData.append("nationality", form.nationality);
        formData.append("age", form.age.toString());
        formData.append("gender", form.gender.toString());
        formData.append("height", form.height.toString());
        formData.append("weight", form.weight.toString());

        if (form.profileImage) {
            formData.append("profileImage", {
                uri: form.profileImage.uri,
                name: form.profileImage.name,
                type: form.profileImage.type,
            } as any);
        }

        await mutateAsync({ data: formData as any });
    };

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
                        <Text className="mt-[100px] mb-8 text-center text-emerald font-pText text-4xl font-normal">
                            Create Profile
                        </Text>

                        <TouchableOpacity
                            onPress={pickImage}
                            className="mb-8 w-32 h-32 rounded-full bg-gray-700 justify-center items-center border-2 border-emerald overflow-hidden"
                        >
                            {form.profileImage ? (
                                <Image
                                    source={{ uri: form.profileImage.uri }}
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

                        <View className="w-full">
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
                                onWeightChange={(weight: number) => setForm({ ...form, weight })}
                            />
                        </View>

                        <FitButton
                            title="Update Profile"
                            handlePress={handleOnSubmit}
                            isLoading={isPending}
                            containerStyles="w-full mt-[40px]"
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}