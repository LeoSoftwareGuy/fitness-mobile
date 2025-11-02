import React from "react";
import { View } from "react-native";
import Skeleton from "./skeleton";


interface SkeletonCardProps {
    lines?: number;
    className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 2, className = "" }) => {
    return (
        <View className={`rounded-xl border border-[#1F1F1F] bg-[#121212] p-3 ${className}`}>
            <Skeleton height={120} className="mb-3 rounded-lg" />
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index} height={14}
                    className={`rounded-md ${index === lines - 1 ? "w-2/3" : "w-full"}`}
                    style={{ marginBottom: index === lines - 1 ? 0 : 10 }}
                />
            ))}
        </View>
    );
};
export default SkeletonCard;