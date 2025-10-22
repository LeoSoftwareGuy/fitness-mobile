import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface UserInfoSectionProps {
    email: string;
}

export default function UserInfoSection({ email }: UserInfoSectionProps) {
    return (
        <View className="w-full mb-3">
            <View className="mb-4">
                <Text className="text-white font-pText text-base mb-2">Email</Text>
                <View className="bg-[#2C2C2C] rounded-lg px-2 py-2.5">
                    <Text className="text-gray font-pRegular text-base">{email}</Text>
                </View>
            </View>

            <View>
                <Text className="text-white font-pText text-base mb-2">Password</Text>
                <TouchableOpacity
                    className="px-2 py-2 flex-row justify-between items-center bg-[#2C2C2C] rounded-lg"
                    onPress={() => router.push("/(auth)/forgot")}
                    activeOpacity={0.7}
                >
                    <Text className="text-gray font-pRegular text-base">••••••••</Text>
                    <Text className="text-emerald font-pMedium text-base">Reset →</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}