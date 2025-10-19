import { Gender } from "@/state/endpoints/api.schemas";
import { Text, TouchableOpacity, View } from "react-native";

interface GenederSelectProps {
    selectedGender: Gender;
    onGenderChange: (gender: Gender) => void;
}

export default function GenderSelect({ selectedGender, onGenderChange }: GenederSelectProps) {
    return (
        <View className="mt-2 w-full">
            <Text className="mb-2 text-base text-white">Gender</Text>
            <View className="flex-row justify-between">
                <TouchableOpacity
                    className={`px-3 py-3 items-center rounded-[20px] ${
                        selectedGender === Gender.NUMBER_0 ? "bg-emerald" : "bg-gray-500"
                    }`}
                    onPress={() => onGenderChange(Gender.NUMBER_0)}
                >
                    <Text className="text-white text-base">Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`px-3 py-3 items-center rounded-[20px] ${
                        selectedGender === Gender.NUMBER_1 ? "bg-emerald" : "bg-gray-500"
                    }`}
                    onPress={() => onGenderChange(Gender.NUMBER_1)}
                >
                    <Text className="text-white text-base">Male</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}