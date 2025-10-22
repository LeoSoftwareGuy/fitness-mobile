import { Gender } from "@/state/endpoints/api.schemas";
import { Text, TouchableOpacity, View } from "react-native";

interface GenderSelectProps {
    selectedGender: Gender;
    onGenderChange: (gender: Gender) => void;
}

export default function GenderSelect({ selectedGender, onGenderChange }: GenderSelectProps) {
    return (
        <View className="mb-3">
            <Text className="text-white font-pText text-base mb-2">Gender</Text>

            <View className="flex-row items-center gap-6">
                {/* Female Option */}
                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => onGenderChange(Gender.NUMBER_0)}
                    activeOpacity={0.7}
                >
                    <View className="w-3 h-3 rounded-full border-2 border-emerald items-center justify-center mr-1">
                        {selectedGender === Gender.NUMBER_0 && (
                            <View className="w-2.5 h-2.5 rounded-full bg-emerald" />
                        )}
                    </View>
                    <Text className="text-white font-pRegular text-base">Female</Text>
                </TouchableOpacity>

                {/* Male Option */}
                <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => onGenderChange(Gender.NUMBER_1)}
                    activeOpacity={0.7}
                >
                    <View className="w-3 h-3 rounded-full border-2 border-emerald items-center justify-center mr-1">
                        {selectedGender === Gender.NUMBER_1 && (
                            <View className="w-3 h-3 rounded-full bg-emerald" />
                        )}
                    </View>
                    <Text className="text-white font-pRegular text-base">Male</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}