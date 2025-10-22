import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProfilePictureProps {
    imageUrl?: string;
    onPress: () => void;
}

export default function ProfilePicture({ imageUrl, onPress }: ProfilePictureProps) {
    return (
        <>
            <TouchableOpacity
                onPress={onPress}
                className="mb-6 w-32 h-32 rounded-full bg-gray-700 justify-center items-center border-2 border-emerald overflow-hidden"
            >
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="items-center">
                        <Text className="text-4xl text-gray-400 mb-2">📷</Text>
                        <Text className="text-xs text-gray-400">Add Photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onPress} className="mb-8">
                <Text className="text-emerald text-sm">Change profile picture</Text>
            </TouchableOpacity>
        </>
    );
}