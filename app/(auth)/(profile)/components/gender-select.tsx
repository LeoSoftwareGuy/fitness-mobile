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
            <View className="flex-row gap-3">
                <TouchableOpacity
                    className={`flex-1 py-4 items-center rounded-lg ${selectedGender === Gender.NUMBER_0 ? "bg-emerald" : "bg-[#2C2C2C]"
                        }`}
                    onPress={() => onGenderChange(Gender.NUMBER_0)}
                    activeOpacity={0.8}
                >
                    <Text className={`font-pMedium text-base ${selectedGender === Gender.NUMBER_0 ? "text-white" : "text-gray"
                        }`}>
                        Female
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-1 py-4 items-center rounded-lg ${selectedGender === Gender.NUMBER_1 ? "bg-emerald" : "bg-[#2C2C2C]"
                        }`}
                    onPress={() => onGenderChange(Gender.NUMBER_1)}
                    activeOpacity={0.8}
                >
                    <Text className={`font-pMedium text-base ${selectedGender === Gender.NUMBER_1 ? "text-white" : "text-gray"
                        }`}>
                        Male
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}