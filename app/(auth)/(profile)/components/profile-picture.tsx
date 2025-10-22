import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProfilePictureProps {
    imageUrl?: string;
    onPress: () => void;
}

export default function ProfilePicture({ imageUrl, onPress }: ProfilePictureProps) {
    return (
        <View className="items-center mb-6">
            <TouchableOpacity
                onPress={onPress}
                className="w-[200px] h-[200px] rounded-full bg-[#2C2C2C] justify-center items-center border-4 border-emerald overflow-hidden mb-4"
            >
                {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="items-center">
                        <Text className="text-6xl mb-2">📷</Text>
                        <Text className="text-sm text-gray font-pRegular">Add Photo</Text>
                    </View>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                <Text className="text-emerald text-base font-pRegular">Change profile picture</Text>
            </TouchableOpacity>
        </View>
    );
}