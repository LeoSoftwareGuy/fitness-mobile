import { Weight } from '@/state/endpoints/api.schemas';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text } from 'react-native';

interface BottomSheetExerciseInfoProps {
  reps: number;
  weight: Weight;
}

export default function BottomSheetExerciseInfo({ reps, weight }: BottomSheetExerciseInfoProps) {
  return (
    <BottomSheetView className="px-1 py-0.5 rounded-lg bg-[#2A2A2A] justify-center items-center">
      <Text className='font-pText text-xs text-white'>
        {reps} x {weight.value === 0 ? "BW" : `${weight.value} ${weight.unit}`}
      </Text>
    </BottomSheetView>
  );
}