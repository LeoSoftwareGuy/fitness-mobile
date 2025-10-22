import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface UserInfoSectionProps {
    firstName: string;
    lastName: string;
    email: string;
}

export default function UserInfoSection({ firstName, lastName, email }: UserInfoSectionProps) {
    return (
        <View className="w-full bg-gray-800 rounded-lg p-4 mb-6">
            <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
                <Text className="text-gray-400">Name</Text>
                <Text className="text-white font-pMedium">
                    {firstName} {lastName}
                </Text>
            </View>
            <View className="flex-row justify-between items-center py-3 border-b border-gray-700">
                <Text className="text-gray-400">Email</Text>
                <Text className="text-white">{email}</Text>
            </View>
            <TouchableOpacity
                className="flex-row justify-between items-center py-3"
                onPress={() => router.push("/(auth)/forgot")}
            >
                <Text className="text-gray-400">Password</Text>
                <Text className="text-emerald">Reset →</Text>
            </TouchableOpacity>
        </View>
    );
}