import { create } from 'zustand';
import { I_User } from '@/utils/interface';

type UserStore = {
    user: I_User | null;
    setUser: (user: I_User) => void;
    clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    clearUser: () => set({ user: null }),
}));