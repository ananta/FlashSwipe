import { Toast } from 'react-native-toast-message/lib/src/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { loginUser } from '../api';

export interface IUserCredentials {
  username: string;
  password: string;
}

export interface IUserInfo extends Omit<IUserCredentials, 'password'> {
  user_id: string;
  token: string;
  first_name: string;
  last_name: string;
}

export type AuthStore = {
  user: IUserInfo;
  isLoading: boolean;
  error: string;
  login: (credentials: IUserCredentials) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isSuccess: boolean;
};

const initialUserState: IUserInfo = {
  user_id: '',
  username: '',
  token: '',
  first_name: '',
  last_name: '',
};

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      user: {
        ...initialUserState,
      },
      isLoggedIn: false,
      isLoading: false,
      isSuccess: false,
      error: '',
      login: async (credentials) => {
        try {
          set({ isLoading: true });
          const data = await loginUser(credentials);
          console.log({ loginData: data });
          set((state) => ({
            ...state,
            isLoading: false,
            isLoggedIn: true,
            isSuccess: true,
            user: {
              ...data,
            },
          }));
          Toast.show({
            type: 'success',
            text1: '👋 Logged in!',
          });
        } catch (err: any) {
          set({
            error: err?.message || 'Something went wrong',
            isLoading: false,
            isSuccess: false,
          });
          Toast.show({
            type: 'error',
            text1: err.message || 'Something went wrong',
          });
        }
      },
      logout: () => {
        set({
          user: initialUserState,
          isLoading: false,
          isLoggedIn: false,
          error: '',
        });
      },
    }),
    {
      name: 'flashswipe-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
