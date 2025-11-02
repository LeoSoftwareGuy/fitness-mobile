import { Weight } from '@/state/endpoints/api.schemas';
import React from 'react';
import { Text, View } from 'react-native';

interface BottomSheetExerciseInfoProps {
  reps: number;
  weight: Weight;
}

export default function BottomSheetExerciseInfo({ reps, weight }: BottomSheetExerciseInfoProps) {
  const displayWeight = weight.value === 0 ? "BW" : `${weight.value} ${weight.unit}`;

  return (
    <View className="px-2 py-0.8 rounded-lg bg-[#2A2A2A] justify-center items-center mr-0.8">
      <Text className='font-pText text-sm text-white'>
        {reps} x {displayWeight}
      </Text>
    </View>
  );
}