import React from "react";
import Skeleton from "./skeleton";

const SkeletonChip: React.FC = () => (
    <Skeleton height={32} borderRadius={16} className="w-24 mr-2" />
);

export default SkeletonChip;