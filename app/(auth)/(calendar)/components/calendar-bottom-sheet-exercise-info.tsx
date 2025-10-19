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
    <BottomSheetView className="mb-1 px-1.5 w-[100px] h-[30px] rounded-[25px] bg-[#e0e0e0] justify-center items-center">
      <Text className='font-pText text-[12px] leading-[22px] font-normal'>
        {reps} x {weight.value} {weight.unit}
      </Text>
    </BottomSheetView>
  );
};