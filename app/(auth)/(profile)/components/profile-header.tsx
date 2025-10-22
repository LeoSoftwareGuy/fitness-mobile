import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function ProfileHeader() {
    return (
        <View className="w-full flex-row justify-between items-center mt-4 mb-8 px-4">
            <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-white text-base">← Back</Text>
            </TouchableOpacity>
            <Text className="text-emerald font-pText text-2xl">Profile</Text>
            <View className="w-12" />
        </View>
    );
}