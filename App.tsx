customer_app_tsx = '''import React, { useEffect, useState } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';

// Import navigation
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';

// Import store
import { useAuthStore } from './src/store/authStore';

// Import theme
import { colors } from './src/constants/colors';

// Ignore specific warnings
LogBox.ignoreLogs([
'ViewPropTypes will be removed',
'ColorPropType will be removed',
]);

const Stack = createStackNavigator();

const App = () => {
const [isLoading, setIsLoading] = useState(true);
const { isAuthenticated, checkAuth } = useAuthStore();

useEffect(() => {
initializeApp();
}, []);

const initializeApp = async () => {
try {
await checkAuth();
} catch (error) {
console.error('App initialization error:', error);
} finally {
setIsLoading(false);
setTimeout(() => {
SplashScreen.hide();
}, 1000);
}
};

if (isLoading) {
return null;
}

return (
<SafeAreaProvider>
<StatusBar  
barStyle="light-content"  
backgroundColor={colors.background}  
translucent  
/>
<NavigationContainer>
<Stack.Navigator
screenOptions={{
headerShown: false,
...TransitionPresets.SlideFromRightIOS,
}}
>
{isAuthenticated ? (
<Stack.Screen name="Main" component={MainNavigator} />
) : (
<Stack.Screen name="Auth" component={AuthNavigator} />
)}
</Stack.Navigator>
</NavigationContainer>
<FlashMessage position="top" />
</SafeAreaProvider>
);
};

export default App;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/App.tsx", "w") as f:
f.write(customer_app_tsx)
