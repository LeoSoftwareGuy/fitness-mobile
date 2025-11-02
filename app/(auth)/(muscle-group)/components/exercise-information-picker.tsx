import { MuscleGroupType, Weight } from "@/state/endpoints/api.schemas";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Text, TextInput, View } from "react-native";
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

    const handleNumericChange = (value: string, key: "Pace" | "Duration" | "Elevation") => {
        if (value.trim().length === 0) {
            onChange({ [key]: undefined });
            return;
        }

        const normalizedValue = value.replace(",", ".");
        const parsed = Number(normalizedValue);
        onChange({ [key]: Number.isFinite(parsed) ? parsed : undefined });
    };

    if (isCardio) {
        return (
            <View className="mt-1.6 w-full">
                <Text className="font-pRegular text-lg text-mediumGray mb-1 text-center">
                    Cardio details
                </Text>

                <View className="flex-row gap-1.2">
                    <View className="flex-1">
                        <Text className="font-pRegular text-sm text-mediumGray mb-0.6">
                            Pace (km/h)
                        </Text>
                        <TextInput
                            className="rounded-lg bg-swamp px-1.2 py-0.8 text-white font-pRegular"
                            keyboardType="numeric"
                            inputMode="decimal"
                            value={parameters.Pace !== undefined ? String(parameters.Pace) : ""}
                            placeholder="e.g. 8.5"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(value) => handleNumericChange(value, "Pace")}
                        />
                    </View>

                    <View className="flex-1">
                        <Text className="font-pRegular text-sm text-mediumGray mb-0.6">
                            Duration (min)
                        </Text>
                        <TextInput
                            className="rounded-lg bg-swamp px-1.2 py-0.8 text-white font-pRegular"
                            keyboardType="numeric"
                            inputMode="decimal"
                            value={parameters.Duration !== undefined ? String(parameters.Duration) : ""}
                            placeholder="e.g. 30"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(value) => handleNumericChange(value, "Duration")}
                        />
                    </View>
                </View>

                <View className="flex-row gap-1.2 mt-1.2">
                    <View className="flex-1">
                        <Text className="font-pRegular text-sm text-mediumGray mb-0.6">
                            Elevation (m)
                        </Text>
                        <TextInput
                            className="rounded-lg bg-swamp px-1.2 py-0.8 text-white font-pRegular"
                            keyboardType="numeric"
                            inputMode="decimal"
                            value={parameters.Elevation !== undefined ? String(parameters.Elevation) : ""}
                            placeholder="e.g. 150"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(value) => handleNumericChange(value, "Elevation")}
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="font-pRegular text-sm text-mediumGray mb-0.6 text-center">
                            Sets
                        </Text>
                        <View className="h-[200px] rounded-lg bg-swamp overflow-hidden">
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
                    </View>
                </View>
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
