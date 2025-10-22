import { Weight } from "@/state/endpoints/api.schemas";
import Slider from "@react-native-community/slider";
import { Text, View } from "react-native";

interface HeightWeightInputProps {
    height?: number;
    weight?: Weight;
    onHeightChange: (height: number) => void;
    onWeightChange: (weight: Weight) => void;
}

export default function HeightWeightInput({
    height,
    weight,
    onHeightChange,
    onWeightChange,
}: HeightWeightInputProps) {
    const heightValue = height && height > 0 ? height : 170;
    const weightValue = weight?.value && weight.value > 0 ? weight.value : 70;

    return (
        <View className="w-full">
            <View className="mb-6">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-pText text-base">Height</Text>
                    <Text className="text-emerald font-pBold text-xl">{heightValue} cm</Text>
                </View>
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={140}
                    maximumValue={220}
                    step={1}
                    value={heightValue}
                    onValueChange={(value) => onHeightChange(value)}
                    minimumTrackTintColor="#006F52"
                    maximumTrackTintColor="#2C2C2C"
                    thumbTintColor="#2AB38E"
                />
            </View>

            <View className="mb-3">
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-pText text-base">Weight</Text>
                    <Text className="text-emerald font-pBold text-xl">{weightValue} kg</Text>
                </View>
                <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={40}
                    maximumValue={200}
                    step={0.5}
                    value={weightValue}
                    onValueChange={(value) => onWeightChange({ value, unit: "kg" })}
                    minimumTrackTintColor="#006F52"
                    maximumTrackTintColor="#2C2C2C"
                    thumbTintColor="#2AB38E"
                />
            </View>
        </View>
    );
}