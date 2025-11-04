import icons from "@/constants/icons";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ProfileHeader() {
    return (
        <View className="w-full">
            <Text className="mx-2 text-emerald font-pText text-3xl text-center">Profile</Text>
            <TouchableOpacity onPress={() => router.back()}>
                <Image
                    source={icons.cross}
                    resizeMode="contain"
                    tintColor="#2AB38E"
                    className="mx-2 mb-2"
                />
            </TouchableOpacity>
        </View>
    );
}