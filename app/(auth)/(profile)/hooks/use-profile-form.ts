import { Gender, Weight } from "@/state/endpoints/api.schemas";
import { useGetUsersBioInfo, useUpdateUserBio } from "@/state/endpoints/auth";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export interface ProfileFormState {
    firstName: string;
    lastName: string;
    nationality: string | null;
    age: number;
    gender: Gender;
    height?: number;
    weight?: Weight;
    profileImageUrl?: string;
}

export function useProfileForm() {
    const { user, isLoaded } = useUser();
    const { isSignedIn } = useAuth();
    const [isLoadingData, setIsLoadingData] = useState(true);

    const { data: savedUserInfo, isLoading } = useGetUsersBioInfo({
        query: {
            enabled: isSignedIn && isLoaded,
            retry: false,
        }
    });

    const [form, setForm] = useState<ProfileFormState>({
        firstName: "",
        lastName: "",
        nationality: null,
        age: 0,
        gender: Gender.NUMBER_2,
        height: 0,
        weight: { value: 0, unit: "kg" },
    });

    useEffect(() => {
        if (isLoaded && user) {
            loadUserData();
        }
    }, [isLoaded, user, savedUserInfo]);

    const loadUserData = async () => {
        try {
            setForm({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                nationality: savedUserInfo?.nationality || null,
                age: savedUserInfo?.age || 0,
                gender: savedUserInfo?.gender || Gender.NUMBER_2,
                height: savedUserInfo?.height || 0,
                weight: savedUserInfo?.weight || { value: 0, unit: "kg" },
                profileImageUrl: user?.imageUrl,
            });
        } catch (error) {
            console.error("Error loading user data:", error);
            setForm({
                firstName: user?.firstName || "",
                lastName: user?.lastName || "",
                nationality: null,
                age: 0,
                gender: Gender.NUMBER_2,
                height: 0,
                weight: { value: 0, unit: "kg" },
                profileImageUrl: user?.imageUrl,
            });
        } finally {
            setIsLoadingData(false);
        }
    };

    const { mutateAsync, isPending } = useUpdateUserBio({
        mutation: {
            onSuccess: () => { },
            onError: (error: any) => {
                Alert.alert("Error", error?.message || "Failed to update profile");
            }
        }
    });

    const updateForm = (updates: Partial<ProfileFormState>) => {
        setForm(prev => ({ ...prev, ...updates }));
    };

    const handleSubmit = async () => {
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

    return {
        form,
        updateForm,
        handleSubmit,
        isLoading: !isLoaded || (isLoading && isLoadingData),
        isSaving: isPending,
        user,
    };
}