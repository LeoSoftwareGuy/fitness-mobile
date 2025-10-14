import React from "react";
import { useWindowDimensions, View } from "react-native";

export default interface CarouselSlide {
    id: string;
    [key: string]: any; // Additional properties can be added as needed
}

interface CarouselSlideProps<T extends CarouselSlide> {
    slide: T;
    renderSlide: (slide: T, width: number) => React.ReactNode;
}

export default function CarouselSlide<T extends CarouselSlide>({ 
  slide, 
  renderSlide 
}: CarouselSlideProps<T>) {
  const { width } = useWindowDimensions();
  
  return (
    <View className="justify-center items-center" style={{ width }}>
      {renderSlide(slide, width)}
    </View>
  );
}
