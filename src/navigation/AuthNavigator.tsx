auth_navigator = '''import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import PhoneInputScreen from '../screens/auth/PhoneInputScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import NameInputScreen from '../screens/auth/NameInputScreen';
import LocationPermissionScreen from '../screens/auth/LocationPermissionScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
return (
<Stack.Navigator
screenOptions={{
headerShown: false,
...TransitionPresets.SlideFromRightIOS,
}}
>
<Stack.Screen name="Onboarding" component={OnboardingScreen} />
<Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
<Stack.Screen name="OTP" component={OTPScreen} />
<Stack.Screen name="NameInput" component={NameInputScreen} />
<Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
</Stack.Navigator>
);
};

export default AuthNavigator;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/navigation/AuthNavigator.tsx", "w") as f:
f.write(auth_navigator)
