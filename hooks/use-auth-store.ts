

import { SecureTokenStorage } from "@/components/biometrics/secure-token-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
}

interface PersistedAuthState {
  user: User | null;
  biometricEnabled: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  biometricEnabled: boolean;
  isAppLocked: boolean;

  setAccessToken: (accessToken: string) => Promise<void>;
  logOut: () => Promise<void>;
  checkAuth: () => Promise<void>;

  // Biometric methods
  checkBiometric: () => Promise<void>;
  enableBiometric: () => Promise<void>;
  disableBiometric: () => Promise<void>;
  unlockApp: () => Promise<boolean>;
  lockApp: () => void;
}

const decodeJWT = (token: string): User | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    return {
      id: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.sub,
      name: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload.name,
      email: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || payload.email,
    };
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};

const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      biometricEnabled: false,
      isAppLocked: false,

      setAccessToken: async (accessToken: string) => {
        const user = decodeJWT(accessToken);

        await SecureTokenStorage.saveAccessToken(accessToken);

        set({
          accessToken,
          user,
          isAuthenticated: true
        });
      },

      logOut: async () => {
        await SecureTokenStorage.clearTokens();

        set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isAppLocked: false,
        });
      },

      checkAuth: async () => {
        try {
          const token = await SecureTokenStorage.getAccessToken(false);

          if (token) {
            const user = decodeJWT(token);
            set({
              accessToken: token,
              user,
              isAuthenticated: true
            });

            // Check if biometric is enabled and lock app
            const biometricEnabled = await SecureTokenStorage.isBiometricEnabled();
            if (biometricEnabled) {
              set({ biometricEnabled: true, isAppLocked: true });
            }
          }
        } catch (error) {
          console.error('Failed to check auth:', error);
        }
      },

      checkBiometric: async () => {
        const enabled = await SecureTokenStorage.isBiometricEnabled();
        set({ biometricEnabled: enabled });
      },

      enableBiometric: async () => {
        await SecureTokenStorage.enableBiometric();
        set({ biometricEnabled: true });
      },

      disableBiometric: async () => {
        await SecureTokenStorage.disableBiometric();
        set({ biometricEnabled: false, isAppLocked: false });
      },

      unlockApp: async () => {
        const success = await SecureTokenStorage.authenticateWithBiometric();
        if (success) {
          set({ isAppLocked: false });
        }
        return success;
      },

      lockApp: () => {
        const biometricEnabled = get().biometricEnabled;
        if (biometricEnabled) {
          set({ isAppLocked: true });
        }
      },
    }),
    {
      name: "userInfo-storage",
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);

export default useAuthStore;