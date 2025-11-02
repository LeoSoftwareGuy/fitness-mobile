import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

interface SkeletonProps {
    height?: number;
    width?: number | string;
    borderRadius?: number;
    className?: string;
    style?: StyleProp<ViewStyle>;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
    height = 16,
    width = "100%",
    borderRadius = 8,
    className = "",
    style,
}) => {
    const opacity = useRef(new Animated.Value(0.6)).current;

    const shimmer = useMemo(() =>
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.4,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        ),
        [opacity]
    );

    useEffect(() => {
        shimmer.start();
        return () => shimmer.stop();
    }, [shimmer]);

    return (
        <Animated.View
            className={`bg-[#2C2C2C] ${className}`}
            style={[
                {
                    height,
                    width: width as any,
                    borderRadius,
                },
                { opacity },
                style,
            ]}
        />
    );
}

export default Skeleton;