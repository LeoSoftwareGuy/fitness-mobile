import React from 'react';
import { Animated, useWindowDimensions, View } from 'react-native';
import CarouselSlide from './carousel-slide';


interface CarouselPaginatorProps<T extends CarouselSlide> {
    data: T[];
    scrollX: Animated.Value;
    dotStyle?: {
        activeColor?: string;
        inactiveColor?: string;
        activeSize?: number;
        inactiveSize?: number;
        spacing?: number;
    };
}

export default function CarouselPaginator<T extends CarouselSlide>({
    data,
    scrollX,
    dotStyle = {}
}: CarouselPaginatorProps<T>) {
    const { width } = useWindowDimensions();

    const {
        activeColor = '#006F52',
        inactiveColor = '#006F52',
        activeSize = 20,
        inactiveSize = 10,
        spacing = 8
    } = dotStyle;

    return (
        <View className="flex-row h-16 justify-center items-center">
            {data.map((_, index) => {
                const inputRange = [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width,
                ];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [inactiveSize, activeSize, inactiveSize],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index.toString()}
                        className="rounded-md"
                        style={{
                            width: dotWidth,
                            height: inactiveSize,
                            backgroundColor: activeColor,
                            opacity,
                            marginHorizontal: spacing / 2,
                        }}
                    />
                );
            })}
        </View>
    );
}