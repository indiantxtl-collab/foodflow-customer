auth_store = '''import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { endpoints } from '../constants/api';

interface User {
id: string;
phone: string;
name: string;
email?: string;
role: string;
location?: any;
addresses?: any[];
}

interface AuthState {
user: User | null;
token: string | null;
isAuthenticated: boolean;
isLoading: boolean;

// Actions
setUser: (user: User | null) => void;
setToken: (token: string | null) => void;
checkAuth: () => Promise<void>;
login: (phone: string, otp: string) => Promise<void>;
register: (data: RegisterData) => Promise<void>;
logout: () => Promise<void>;
updateProfile: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
phone: string;
name: string;
email?: string;
location?: any;
}

export const useAuthStore = create<AuthState>((set, get) => ({
user: null,
token: null,
isAuthenticated: false,
isLoading: false,

setUser: (user) => set({ user }),
setToken: (token) => set({ token }),

checkAuth: async () => {
try {
const token = await AsyncStorage.getItem('token');
if (token) {
const response = await api.get(endpoints.auth.me);
set({
user: response.data.user,
token,
isAuthenticated: true,
});
}
} catch (error) {
await AsyncStorage.removeItem('token');
set({ user: null, token: null, isAuthenticated: false });
}
},

login: async (phone, otp) => {
try {
set({ isLoading: true });

// First verify OTP  
  const verifyResponse = await api.post(endpoints.auth.verifyOTP, {  
    phone,  
    otp,  
  });  

  if (verifyResponse.data.status !== 'approved') {  
    throw new Error('Invalid OTP');  
  }  

  // Then login  
  const loginResponse = await api.post(endpoints.auth.login, { phone });  
    
  const { token, user } = loginResponse.data;  
  await AsyncStorage.setItem('token', token);  
    
  set({  
    user,  
    token,  
    isAuthenticated: true,  
    isLoading: false,  
  });  
} catch (error) {  
  set({ isLoading: false });  
  throw error;  
}

},

register: async (data) => {
try {
set({ isLoading: true });
const response = await api.post(endpoints.auth.register, data);

const { token, user } = response.data;  
  await AsyncStorage.setItem('token', token);  
    
  set({  
    user,  
    token,  
    isAuthenticated: true,  
    isLoading: false,  
  });  
} catch (error) {  
  set({ isLoading: false });  
  throw error;  
}

},

logout: async () => {
await AsyncStorage.removeItem('token');
set({
user: null,
token: null,
isAuthenticated: false,
});
},

updateProfile: async (data) => {
try {
const response = await api.put(endpoints.user.profile, data);
set({ user: { ...get().user!, ...response.data.data } });
} catch (error) {
throw error;
}
},
}));
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/store/authStore.ts", "w") as f:
f.write(auth_store)
