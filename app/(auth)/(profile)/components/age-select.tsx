import { useCallback } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface AgeSelectProps {
    age: string;
    onAgeChange: (age: string) => void;
}

export default function AgeSelect({ age, onAgeChange }: AgeSelectProps) {
    const handleAgeInput = (input: string) => {
        if (
            /^\d*$/.test(input) &&
            (input === "" || (parseInt(input, 10) >= 1 && parseInt(input, 10) <= 200))
        ) {
            onAgeChange(input);
        }
    };

    const incrementAge = useCallback(() => {
        const ageNumber = age === "" || age === "0" ? 0 : parseInt(age, 10);
        if (ageNumber < 200) {
            onAgeChange((ageNumber + 1).toString());
        }
    }, [age]);

    const decrementAge = useCallback(() => {
        const ageNumber = age === "" || age === "0" ? 1 : parseInt(age, 10);
        if (ageNumber > 1) {
            onAgeChange((ageNumber - 1).toString());
        }
    }, [age]);

    return (
        <View className="mb-2.5">
            <Text className="text-white font-pText text-base mb-2">Age</Text>
            <View className="flex-row items-center bg-[#2C2C2C] rounded-lg overflow-hidden">
                <TouchableOpacity
                    onPress={decrementAge}
                    className="py-2 px-3 active:bg-[#1C1C1C]"
                    activeOpacity={0.7}
                >
                    <Text className="text-emerald text-2xl font-pBold">-</Text>
                </TouchableOpacity>

                <View className="flex-1 items-center">
                    <TextInput
                        className="text-center text-xl text-white font-pMedium w-full"
                        value={age === "0" ? "" : age}
                        keyboardType="numeric"
                        placeholder="Enter Age"
                        placeholderTextColor="#666666"
                        onChangeText={handleAgeInput}
                    />
                </View>

                <TouchableOpacity
                    onPress={incrementAge}
                    className="py-2 px-3 active:bg-[#1C1C1C]"
                    activeOpacity={0.7}
                >
                    <Text className="text-emerald text-2xl font-pBold">+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}