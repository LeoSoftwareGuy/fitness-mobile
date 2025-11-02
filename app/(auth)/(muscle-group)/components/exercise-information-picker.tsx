import { MuscleGroupType, Weight } from "@/state/endpoints/api.schemas";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import React from "react";
import { Text, View } from "react-native";
import { ExerciseParameters } from "./exercise-bottom-sheet";

interface ExerciseInfoPickerProps {
    parameters: ExerciseParameters;
    muscleGroupType: MuscleGroupType;
    onChange: (params: Partial<ExerciseParameters>) => void;
}

export default function ExerciseInfoPicker({ onChange, parameters, muscleGroupType }: ExerciseInfoPickerProps) {
    const repsItems = Array.from({ length: 50 }, (_, i) => i + 1);
    const setsItems = Array.from({ length: 10 }, (_, i) => i + 1);
    const weightsItems: Weight[] = [
        { value: 0, unit: "bodyweight" },
        ...Array.from({ length: 200 }, (_, i) => ({
            value: (i + 1) * 2.5,
            unit: "kg"
        })),
    ];

    const isWeightEqual = (w1: Weight, w2: Weight): boolean => {
        return w1.value === w2.value && w1.unit === w2.unit;
    };

    const getWeightLabel = (weight: Weight): string => {
        if (weight.value === 0) return "Bodyweight";
        return `${weight.value}${weight.unit}`;
    };

    const isCardio = muscleGroupType === MuscleGroupType.NUMBER_3;
    const currentWeight = parameters.Weight ?? weightsItems[0];
    const selectedWeightIndex = Math.max(
        0,
        weightsItems.findIndex((w) => isWeightEqual(w, currentWeight))
    );

    const paceValue = parameters.Pace ?? 8;
    const durationValue = parameters.Duration ?? 30;
    const elevationValue = parameters.Elevation ?? 0;
    const setsValue = parameters.Sets ?? 1;

    if (isCardio) {
        return (
            <View className="mt-1.6 w-full">
                <Text className="font-pRegular text-lg text-mediumGray mb-1 text-center">
                    Cardio details
                </Text>

                <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-pRegular text-sm text-mediumGray">Pace</Text>
                        <Text className="font-pText text-white text-base">{paceValue.toFixed(1)} km/h</Text>
                    </View>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={3}
                        maximumValue={22}
                        step={0.5}
                        value={paceValue}
                        onValueChange={(value) => onChange({ Pace: Number(value.toFixed(1)) })}
                        minimumTrackTintColor="#006F52"
                        maximumTrackTintColor="#2C2C2C"
                        thumbTintColor="#2AB38E"
                    />
                </View>

                <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-pRegular text-sm text-mediumGray">Duration</Text>
                        <Text className="font-pText text-white text-base">{Math.round(durationValue)} min</Text>
                    </View>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={5}
                        maximumValue={180}
                        step={1}
                        value={durationValue}
                        onValueChange={(value) => onChange({ Duration: Math.round(value) })}
                        minimumTrackTintColor="#006F52"
                        maximumTrackTintColor="#2C2C2C"
                        thumbTintColor="#2AB38E"
                    />
                </View>

                <View className="mb-4">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-pRegular text-sm text-mediumGray">Elevation</Text>
                        <Text className="font-pText text-white text-base">{Math.round(elevationValue)} m</Text>
                    </View>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={1000}
                        step={10}
                        value={elevationValue}
                        onValueChange={(value) => onChange({ Elevation: Math.round(value) })}
                        minimumTrackTintColor="#006F52"
                        maximumTrackTintColor="#2C2C2C"
                        thumbTintColor="#2AB38E"
                    />
                </View>

                <View className="mb-2">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-pRegular text-sm text-mediumGray">Sets</Text>
                        <Text className="font-pText text-white text-base">{setsValue}</Text>
                    </View>
                    <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={1}
                        maximumValue={10}
                        step={1}
                        value={setsValue}
                        onValueChange={(value) => onChange({ Sets: Math.round(value) })}
                        minimumTrackTintColor="#006F52"
                        maximumTrackTintColor="#2C2C2C"
                        thumbTintColor="#2AB38E"
                    />
                </View>

                <Text className="text-center text-xs text-mediumGray mt-1">
                    Cardio metrics are stored per set and converted to seconds automatically.
                </Text>
            </View>
        );
    }

    return (
        <View className="mt-1.6 w-full">
            <View className="pb-1.2 flex-row justify-around">
                <Text className="font-pRegular text-lg text-mediumGray w-[30%] text-center">
                    Reps
                </Text>
                <Text className="font-pRegular text-lg text-mediumGray w-[30%] text-center">
                    Sets
                </Text>
                <Text className="font-pRegular text-lg text-mediumGray w-[30%] text-center">
                    Weight
                </Text>
            </View>

            <View className="flex-row justify-around bg-swamp rounded-lg overflow-hidden">
                {/* Reps Picker */}
                <View className="w-[30%] h-[200px]">
                    <Picker
                        selectedValue={parameters.Reps ?? repsItems[0]}
                        onValueChange={(value) => onChange({ Reps: value })}
                        style={{ color: "white", backgroundColor: "transparent" }}
                        itemStyle={{ color: "white", fontSize: 18, height: 200 }}
                    >
                        {repsItems.map((rep) => (
                            <Picker.Item
                                key={rep}
                                label={`${rep}`}
                                value={rep}
                                color="white"
                            />
                        ))}
                    </Picker>
                </View>

                {/* Sets Picker */}
                <View className="w-[30%] h-[200px]">
                    <Picker
                        selectedValue={parameters.Sets}
                        onValueChange={(value) => onChange({ Sets: value })}
                        style={{ color: "white", backgroundColor: "transparent" }}
                        itemStyle={{ color: "white", fontSize: 18, height: 200 }}
                    >
                        {setsItems.map((set) => (
                            <Picker.Item
                                key={set}
                                label={`${set}`}
                                value={set}
                                color="white"
                            />
                        ))}
                    </Picker>
                </View>

                {/* Weight Picker */}
                <View className="w-[30%] h-[200px]">
                    <Picker
                        selectedValue={selectedWeightIndex}
                        onValueChange={(index) => {
                            if (index >= 0 && index < weightsItems.length) {
                                onChange({ Weight: weightsItems[index] });
                            }
                        }}
                        style={{ color: "white", backgroundColor: "transparent" }}
                        itemStyle={{ color: "white", fontSize: 18, height: 200 }}
                    >
                        {weightsItems.map((weight, index) => (
                            <Picker.Item
                                key={index}
                                label={getWeightLabel(weight)}
                                value={index}
                                color="white"
                            />
                        ))}
                    </Picker>
                </View>
            </View>
        </View>
    );
}
