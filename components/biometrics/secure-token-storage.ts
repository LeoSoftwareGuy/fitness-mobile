import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export class SecureTokenStorage {
    private static readonly ACCESS_TOKEN_KEY = 'accessToken';
    private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
    private static readonly BIOMETRIC_ENABLED_KEY = 'biometricEnabled';

    static async isBiometricAvailable(): Promise<boolean> {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        return compatible && enrolled;
    }

    static async getBiometricType(): Promise<string> {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            return 'Face ID';
        }
        if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            return 'Touch ID';
        }
        return 'Biometric';
    }

    static async enableBiometric(): Promise<void> {
        await SecureStore.setItemAsync(
            this.BIOMETRIC_ENABLED_KEY,
            'true',
            {
                keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            }
        );
    }

    static async isBiometricEnabled(): Promise<boolean> {
        const enabled = await SecureStore.getItemAsync(this.BIOMETRIC_ENABLED_KEY);
        return enabled === 'true';
    }

    static async authenticateWithBiometric(): Promise<boolean> {
        const biometricType = await this.getBiometricType();
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: `Unlock FitTrack with ${biometricType}`,
            fallbackLabel: 'Use passcode',
            disableDeviceFallback: false,
            cancelLabel: 'Cancel',
        });
        return result.success;
    }

    static async saveAccessToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, token, {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
    }

    static async saveRefreshToken(token: string): Promise<void> {
        await SecureStore.setItemAsync(this.REFRESH_TOKEN_KEY, token, {
            keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        });
    }

    static async getAccessToken(requireBiometric: boolean = false): Promise<string | null> {
        if (requireBiometric) {
            const biometricEnabled = await this.isBiometricEnabled();
            if (biometricEnabled) {
                const authenticated = await this.authenticateWithBiometric();
                if (!authenticated) {
                    throw new Error('Biometric authentication failed');
                }
            }
        }

        return await SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY);
    }

    static async getRefreshToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(this.REFRESH_TOKEN_KEY);
    }

    static async clearTokens(): Promise<void> {
        await SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY);
    }

    static async disableBiometric(): Promise<void> {
        await SecureStore.deleteItemAsync(this.BIOMETRIC_ENABLED_KEY);
    }
}