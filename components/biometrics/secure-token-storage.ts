import * as SecureStore from 'expo-secure-store';

export default function tokenCache() {
    return {
        async getToken(key: string): Promise<string | null> {
            return await SecureStore.getItemAsync(key);
        },
        async saveToken(key: string, value: string): Promise<void> {
            await SecureStore.setItemAsync(key, value);
        },
        async deleteToken(key: string): Promise<void> {
            await SecureStore.deleteItemAsync(key);
        },
    }
}