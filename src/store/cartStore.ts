cart_store = '''import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
menuItemId: string;
name: string;
price: number;
quantity: number;
image?: string;
variants?: any[];
addons?: any[];
specialInstructions?: string;
}

interface RestaurantInfo {
id: string;
name: string;
deliveryFee: number;
minOrderAmount: number;
}

interface CartState {
items: CartItem[];
restaurant: RestaurantInfo | null;
coupon: { code: string; discount: number } | null;

// Getters
itemCount: () => number;
subtotal: () => number;
total: () => number;

// Actions
addItem: (item: CartItem, restaurant: RestaurantInfo) => void;
removeItem: (menuItemId: string) => void;
updateQuantity: (menuItemId: string, quantity: number) => void;
clearCart: () => void;
applyCoupon: (code: string, discount: number) => void;
removeCoupon: () => void;
loadCart: () => Promise<void>;
}

const CART_STORAGE_KEY = '@foodflow_cart';

export const useCartStore = create<CartState>((set, get) => ({
items: [],
restaurant: null,
coupon: null,

itemCount: () => {
return get().items.reduce((sum, item) => sum + item.quantity, 0);
},

subtotal: () => {
return get().items.reduce((sum, item) => {
let itemTotal = item.price * item.quantity;
if (item.variants) {
itemTotal += item.variants.reduce((vSum, v) => vSum + (v.price * item.quantity), 0);
}
if (item.addons) {
itemTotal += item.addons.reduce((aSum, a) => aSum + (a.price * item.quantity), 0);
}
return sum + itemTotal;
}, 0);
},

total: () => {
const state = get();
const subtotal = state.subtotal();
const deliveryFee = state.restaurant?.deliveryFee || 0;
const platformFee = 5;
const tax = Math.round(subtotal * 0.05);
const discount = state.coupon?.discount || 0;
return subtotal + deliveryFee + platformFee + tax - discount;
},

addItem: (item, restaurant) => {
set((state) => {
// Check if adding from different restaurant
if (state.restaurant && state.restaurant.id !== restaurant.id) {
// Replace cart
return {
items: [item],
restaurant,
coupon: null,
};
}

const existingIndex = state.items.findIndex(  
    (i) => i.menuItemId === item.menuItemId  
  );  

  let newItems;  
  if (existingIndex > -1) {  
    newItems = [...state.items];  
    newItems[existingIndex].quantity += item.quantity;  
  } else {  
    newItems = [...state.items, item];  
  }  

  return {  
    items: newItems,  
    restaurant: state.restaurant || restaurant,  
  };  
});  
  
// Persist to storage  
const state = get();  
AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify({  
  items: state.items,  
  restaurant: state.restaurant,  
}));

},

removeItem: (menuItemId) => {
set((state) => ({
items: state.items.filter((i) => i.menuItemId !== menuItemId),
}));

const state = get();  
if (state.items.length === 0) {  
  set({ restaurant: null, coupon: null });  
}  
  
AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify({  
  items: get().items,  
  restaurant: get().restaurant,  
}));

},

updateQuantity: (menuItemId, quantity) => {
if (quantity <= 0) {
get().removeItem(menuItemId);
return;
}

set((state) => ({  
  items: state.items.map((i) =>  
    i.menuItemId === menuItemId ? { ...i, quantity } : i  
  ),  
}));  
  
AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify({  
  items: get().items,  
  restaurant: get().restaurant,  
}));

},

clearCart: () => {
set({ items: [], restaurant: null, coupon: null });
AsyncStorage.removeItem(CART_STORAGE_KEY);
},

applyCoupon: (code, discount) => {
set({ coupon: { code, discount } });
},

removeCoupon: () => {
set({ coupon: null });
},

loadCart: async () => {
try {
const saved = await AsyncStorage.getItem(CART_STORAGE_KEY);
if (saved) {
const { items, restaurant } = JSON.parse(saved);
set({ items: items || [], restaurant });
}
} catch (error) {
console.error('Load cart error:', error);
}
},
}));
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/store/cartStore.ts", "w") as f:
f.write(cart_store)
