main_navigator = '''import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import RestaurantScreen from '../screens/restaurant/RestaurantScreen';
import CartScreen from '../screens/orders/CartScreen';
import CheckoutScreen from '../screens/orders/CheckoutScreen';
import OrderTrackingScreen from '../screens/orders/OrderTrackingScreen';

import { colors } from '../constants/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
return (
<Tab.Navigator
screenOptions={({ route }) => ({
headerShown: false,
tabBarStyle: {
backgroundColor: colors.backgroundLight,
borderTopWidth: 0,
elevation: 0,
height: 60,
paddingBottom: 8,
},
tabBarActiveTintColor: colors.primary,
tabBarInactiveTintColor: colors.textMuted,
tabBarIcon: ({ focused, color, size }) => {
let iconName: string = '';

switch (route.name) {  
        case 'Home':  
          iconName = focused ? 'home' : 'home-outline';  
          break;  
        case 'Search':  
          iconName = focused ? 'search' : 'search-outline';  
          break;  
        case 'Orders':  
          iconName = focused ? 'list' : 'list-outline';  
          break;  
        case 'Profile':  
          iconName = focused ? 'person' : 'person-outline';  
          break;  
      }  

      return <Icon name={iconName} size={size} color={color} />;  
    },  
  })}  
>  
  <Tab.Screen name="Home" component={HomeScreen} />  
  <Tab.Screen name="Search" component={SearchScreen} />  
  <Tab.Screen name="Orders" component={OrdersScreen} />  
  <Tab.Screen name="Profile" component={ProfileScreen} />  
</Tab.Navigator>

);
};

const MainNavigator = () => {
return (
<Stack.Navigator screenOptions={{ headerShown: false }}>
<Stack.Screen name="Tabs" component={TabNavigator} />
<Stack.Screen name="Restaurant" component={RestaurantScreen} />
<Stack.Screen name="Cart" component={CartScreen} />
<Stack.Screen name="Checkout" component={CheckoutScreen} />
<Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
</Stack.Navigator>
);
};

export default MainNavigator;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/navigation/MainNavigator.tsx", "w") as f:
f.write(main_navigator)
