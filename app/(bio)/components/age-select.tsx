import { useCallback } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface AgeSelectProps {
    age: string;
    onAgeChange: (age: string) => void;
}

export default function AgeSelect({ age, onAgeChange }: AgeSelectProps) {

    const handleAgeInput = (input: string) => {
        // Allow only numbers or empty string
        if (
            /^\d*$/.test(input) &&
            (input === "" || (parseInt(input, 10) >= 1 && parseInt(input, 10) <= 200))
        ) {
            onAgeChange(input);
        }
    };

    const incrementAge = useCallback(() => {
        const ageNumber = age === "" ? 0 : parseInt(age, 10);
        if (ageNumber < 200) {
            onAgeChange((ageNumber + 1).toString());
        }
    }, [age]);

    const decrementAge = useCallback(() => {
        const ageNumber = age === "" ? 1 : parseInt(age, 10);
        if (ageNumber > 1) {
            onAgeChange((ageNumber - 1).toString());
        }
    }, [age]);

    return (
        <View className="my-4 items-start">
            <Text className="text-white text-base mb-2">Age</Text>
            <View className="flex-row items-center bg-gray-500 rounded-lg">
                <TouchableOpacity onPress={decrementAge} className="py-3 px-4">
                    <Text className="text-white text-lg">-</Text>
                </TouchableOpacity>
                <TextInput
                    className="flex-1 py-3 text-center text-base text-white"
                    value={age}
                    keyboardType="numeric"
                    placeholder="Enter Age"
                    placeholderTextColor="white"
                    onChangeText={handleAgeInput}
                />
                <TouchableOpacity onPress={incrementAge} className="py-3 px-4">
                    <Text className="text-white text-lg">+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}