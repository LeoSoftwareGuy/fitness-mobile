
import Carousel from "@/components/carousel/carousel";
import { images } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface OnBoardingSlide {
    id: string;
    title: string;
    highlightWords?: string[];
}

const slides: OnBoardingSlide[] = [
    {
        id: "1",
        title: "This app is your personal fitness companion, designed to track and optimize your workouts.",
        highlightWords: ["track", "optimize"]
    },
    {
        id: "2",
        title: "Log exercises, sets and reps with ease, while monitoring your progress over time.",
        highlightWords: ["progress"]
    },
    {
        id: "3",
        title: "Whether you're a beginner or an experienced athlete, this app helps you stay on track.",
        highlightWords: ["stay on track"]
    },
];

const renderOnBoardingSlide = (item: OnBoardingSlide, width: number) => {
    const highlightText = (text: string, highlights: string[] = []) => {
        if (highlights.length === 0) {
            return <Text className="font-pText text-4xl text-white text-center">{text}</Text>;
        }

        const parts = [];
        let remainingText = text;
        let currentIndex = 0;

        highlights.forEach(highlight => {
            const index = remainingText.toLowerCase().indexOf(highlight.toLowerCase());
            if (index !== -1) {
                if (index > 0) {
                    parts.push(remainingText.substring(0, index));
                }
                parts.push(
                    <Text key={`${highlight}-${currentIndex}`} className="text-emerald">
                        {remainingText.substring(index, index + highlight.length)}
                    </Text>
                );
                remainingText = remainingText.substring(index + highlight.length);
                currentIndex++;
            }
        });

        if (remainingText) {
            parts.push(remainingText);
        }

        return (
            <Text className="font-pText text-4xl text-white text-center">
                {parts}
            </Text>
        );
    };

    return (
        <View className="mt-14 p-5 justify-center">
            {highlightText(item.title, item.highlightWords)}
        </View>
    );
};

export default function OnBoardingScreen() {
    return (
        <LinearGradient
            colors={["#3F3F3F", "#151515"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            locations={[0, 0.35]}
            style={{ flex: 1 }}>
            <SafeAreaView>
                <Image
                    source={images.FitTrack}
                    resizeMode='contain'
                    className="mt-5 mx-auto" />
                <Carousel
                    data={slides}
                    renderSlide={renderOnBoardingSlide}
                    containerClassName="flex-1 justify-center items-center"
                    paginatorStyle={{
                        activeColor: '#10b981',
                        inactiveColor: '#6b7280',
                        activeSize: 24,
                        inactiveSize: 12,
                    }}
                />
                <TouchableOpacity onPress={() => router.push("/(tabs)/home")}>
                    <Text className="pt-[10px] pb-[55px] font-pRegular text-[16px] text-center text-darkGray">
                        Skip
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    )
}