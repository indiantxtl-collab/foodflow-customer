api_config = '''import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://your-api-url.com/api'; // Change to your backend URL

const api = axios.create({
baseURL: API_BASE_URL,
timeout: 30000,
headers: {
'Content-Type': 'application/json',
},
});

// Request interceptor
api.interceptors.request.use(
async (config) => {
const token = await AsyncStorage.getItem('token');
if (token) {
config.headers.Authorization = Bearer ${token};
}
return config;
},
(error) => {
return Promise.reject(error);
}
);

// Response interceptor
api.interceptors.response.use(
(response) => response,
async (error) => {
if (error.response?.status === 401) {
await AsyncStorage.removeItem('token');
// Handle token expiration
}
return Promise.reject(error);
}
);

export default api;

export const endpoints = {
auth: {
sendOTP: '/auth/send-otp',
verifyOTP: '/auth/verify-otp',
register: '/auth/register',
login: '/auth/login',
me: '/auth/me',
},
restaurants: {
list: '/restaurants',
detail: (id: string) => /restaurants/${id},
menu: (id: string) => /restaurants/${id}/menu,
},
orders: {
create: '/orders',
list: '/orders/my-orders',
detail: (id: string) => /orders/${id},
cancel: (id: string) => /orders/${id}/cancel,
rate: (id: string) => /orders/${id}/rate,
},
user: {
profile: '/users/profile',
addresses: '/users/addresses',
location: '/users/location',
},
coupons: {
list: '/coupons',
validate: '/coupons/validate',
},
payments: {
createOrder: '/payments/create-order',
verify: '/payments/verify',
upiIntent: '/payments/upi-intent',
},
};
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/constants/api.ts", "w") as f:
f.write(api_config)
