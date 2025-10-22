import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfileHeader() {
    return (
        <View className="w-full">
            <Text className="mx-2 text-emerald font-pText text-3xl text-center">Profile</Text>
            <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-white text-base">← Back</Text>
            </TouchableOpacity>
        </View>
    );
}