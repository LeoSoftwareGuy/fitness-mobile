import { Weight } from "@/state/endpoints/api.schemas";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Text, View } from "react-native";
import { ExerciseParameters } from "./exercise-bottom-sheet";

interface ExerciseInfoPickerProps {
    parameters: ExerciseParameters;
    onChange: (params: Partial<ExerciseParameters>) => void;
}

export default function ExerciseInfoPicker({ onChange, parameters }: ExerciseInfoPickerProps) {
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
                        selectedValue={parameters.Reps}
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
                        selectedValue={weightsItems.findIndex(w => isWeightEqual(w, parameters.Weight))}
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