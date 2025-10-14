import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoadingIndicator = () => (
    <SafeAreaView className="h-full flex items-center justify-center">
        <ActivityIndicator size="large" color="#2AB38E" />
        <Text className="text-white mt-4">Loading Trainings...</Text>
    </SafeAreaView>
);

export default LoadingIndicator;