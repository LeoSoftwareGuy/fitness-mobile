import React, { useCallback, useRef, useState } from 'react';
import {
    Animated,
    View,
} from 'react-native';

import { FlashList, FlashListRef, ListRenderItem, ViewToken } from '@shopify/flash-list';
import CarouselPaginator from './carousel-paginator';
import CarouselSlide from './carousel-slide';

interface CarouselProps<T extends CarouselSlide> {
    data: T[];
    renderSlide: (item: T, width: number) => React.ReactNode;
    showPaginator?: boolean;
    paginatorStyle?: {
        activeColor?: string;
        inactiveColor?: string;
        activeSize?: number;
        inactiveSize?: number;
        spacing?: number;
    };
    onSlideChange?: (index: number) => void;
    containerClassName?: string;
    autoScroll?: boolean;
    autoScrollInterval?: number;
}

export default function Carousel<T extends CarouselSlide>({
    data,
    renderSlide,
    showPaginator = true,
    paginatorStyle,
    onSlideChange,
    containerClassName = "flex-1 justify-center items-center",
    autoScroll = false,
    autoScrollInterval = 3000,
}: CarouselProps<T>) {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlashListRef<T>>(null);

    // Auto scroll functionality
    React.useEffect(() => {
        if (!autoScroll || data.length <= 1) return;

        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % data.length;
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        }, autoScrollInterval);

        return () => clearInterval(interval);
    }, [autoScroll, autoScrollInterval, currentIndex, data.length]);

    const viewableItemsChanged = useCallback(
        ({ viewableItems }: { viewableItems: Array<ViewToken<any>> }) => {
            const visibleItem = viewableItems[0];
            if (visibleItem?.index !== null && visibleItem?.index !== undefined) {
                setCurrentIndex(visibleItem.index);
                onSlideChange?.(visibleItem.index);
            }
        },
        [onSlideChange]
    );

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const renderItem: ListRenderItem<T> = ({ item }) => (
        <CarouselSlide slide={item} renderSlide={renderSlide} />
    );

    return (
        <View className={containerClassName}>
            <FlashList
                ref={flatListRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal // horizontal scrolling
                pagingEnabled // snap to each slide
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )} // updates scrollX value per swipe
                onViewableItemsChanged={viewableItemsChanged} //track which side is visible
                viewabilityConfig={viewConfig}
                scrollEventThrottle={32}
                bounces={false}
                decelerationRate="fast"
            />

            {showPaginator && (
                <CarouselPaginator
                    data={data}
                    scrollX={scrollX}
                    dotStyle={paginatorStyle}
                />
            )}
        </View>
    );
}
