import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";

interface AgeSelectProps {
    age: string;
    onAgeChange: (age: string) => void;
}

export default function AgeSelect({ age, onAgeChange }: AgeSelectProps) {
    const ageValue = age === "" || age === "0" ? 18 : parseInt(age, 10);

    return (
        <View className="mb-6">
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white font-pText text-base">Age</Text>
                <Text className="text-emerald font-pBold text-xl">{ageValue}</Text>
            </View>
            <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={10}
                maximumValue={100}
                step={1}
                value={ageValue}
                onValueChange={(value) => onAgeChange(value.toString())}
                minimumTrackTintColor="#006F52"
                maximumTrackTintColor="#2C2C2C"
                thumbTintColor="#2AB38E"
            />
        </View>
    );
}