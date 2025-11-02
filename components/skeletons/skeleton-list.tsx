import React from "react";
import { View } from "react-native";
import Skeleton from "./skeleton";

interface SkeletonListProps {
    rows?: number;
    className?: string;
}

const SkeletonList: React.FC<SkeletonListProps> = ({ rows = 4, className = "" }) => {
    return (
        <View className={className}>
            {Array.from({ length: rows }).map((_, index) => (
                <Skeleton
                    key={index}
                    height={18}
                    className="w-full rounded-md"
                    style={{ marginBottom: index === rows - 1 ? 0 : 12 }}
                />
            ))}
        </View>
    );
};

export default SkeletonList;
