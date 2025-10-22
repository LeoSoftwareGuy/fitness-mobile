import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export function useProfileImage(onImageUpdate: (uri: string) => void) {
    const { user } = useUser();

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
                            onImageUpdate(imageUri);
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

    return { pickImage };
}