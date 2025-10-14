import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ErrorMessage = ({ message }: { message: string }) => (
    <SafeAreaView className="h-full flex items-center justify-center">
        <Text className="text-red-500">{message}</Text>
    </SafeAreaView>
);

export default ErrorMessage;