location_permission_screen = '''import React from 'react';
import {
View,
Text,
StyleSheet,
TouchableOpacity,
StatusBar,
Platform,
PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
useSharedValue,
useAnimatedStyle,
withRepeat,
withTiming,
withSpring,
} from 'react-native-reanimated';
import Geolocation from 'react-native-geolocation-service';

import { colors, gradients, spacing } from '../../constants/colors';
import { GradientButton } from '../../components/ui/GradientButton';
import { showMessage } from 'react-native-flash-message';

const LocationPermissionScreen = () => {
const navigation = useNavigation();
const pulseAnim = useSharedValue(1);

React.useEffect(() => {
pulseAnim.value = withRepeat(
withTiming(1.2, { duration: 1000 }),
-1,
true
);
}, []);

const pulseStyle = useAnimatedStyle(() => ({
transform: [{ scale: pulseAnim.value }],
opacity: 2 - pulseAnim.value,
}));

const requestLocationPermission = async () => {
try {
if (Platform.OS === 'android') {
const granted = await PermissionsAndroid.request(
PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
{
title: 'FoodFlow Location Permission',
message: 'FoodFlow needs access to your location to show nearby restaurants',
buttonNeutral: 'Ask Me Later',
buttonNegative: 'Cancel',
buttonPositive: 'OK',
}
);

if (granted === PermissionsAndroid.RESULTS.GRANTED) {  
      getCurrentLocation();  
    } else {  
      showMessage({  
        message: 'Permission Denied',  
        description: 'You can enable location later in settings',  
        type: 'warning',  
      });  
      navigation.navigate('Main' as never);  
    }  
  } else {  
    // iOS  
    const auth = await Geolocation.requestAuthorization('whenInUse');  
    if (auth === 'granted') {  
      getCurrentLocation();  
    } else {  
      navigation.navigate('Main' as never);  
    }  
  }  
} catch (err) {  
  console.warn(err);  
  navigation.navigate('Main' as never);  
}

};

const getCurrentLocation = () => {
Geolocation.getCurrentPosition(
(position) => {
console.log('Location:', position);
showMessage({
message: 'Location Access Granted',
type: 'success',
});
navigation.navigate('Main' as never);
},
(error) => {
console.error('Location Error:', error);
navigation.navigate('Main' as never);
},
{ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
);
};

const handleSkip = () => {
navigation.navigate('Main' as never);
};

return (
<LinearGradient colors={gradients.dark} style={styles.container}>
<StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

<View style={styles.content}>  
    {/* Location Icon with Pulse */}  
    <View style={styles.iconContainer}>  
      <Animated.View style={[styles.pulseRing, pulseStyle]} />  
      <View style={styles.iconBackground}>  
        <Icon name="location" size={64} color={colors.primary} />  
      </View>  
    </View>  

    {/* Text */}  
    <Text style={styles.title}>Enable Location</Text>  
    <Text style={styles.subtitle}>  
      Allow FoodFlow to access your location to find the best restaurants near you and provide accurate delivery tracking  
    </Text>  

    {/* Features */}  
    <View style={styles.features}>  
      <View style={styles.featureItem}>  
        <Icon name="restaurant" size={20} color={colors.primary} />  
        <Text style={styles.featureText}>Find nearby restaurants</Text>  
      </View>  
      <View style={styles.featureItem}>  
        <Icon name="time" size={20} color={colors.primary} />  
        <Text style={styles.featureText}>Accurate delivery time</Text>  
      </View>  
      <View style={styles.featureItem}>  
        <Icon name="navigate" size={20} color={colors.primary} />  
        <Text style={styles.featureText}>Live order tracking</Text>  
      </View>  
    </View>  

    {/* Buttons */}  
    <View style={styles.buttonContainer}>  
      <GradientButton  
        title="Enable Location"  
        onPress={requestLocationPermission}  
        size="large"  
        style={styles.button}  
      />  
        
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>  
        <Text style={styles.skipText}>Not Now</Text>  
      </TouchableOpacity>  
    </View>  
  </View>  
</LinearGradient>

);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
},
content: {
flex: 1,
padding: spacing.xl,
justifyContent: 'center',
alignItems: 'center',
paddingTop: 60,
},
iconContainer: {
marginBottom: spacing.xxl,
alignItems: 'center',
justifyContent: 'center',
},
pulseRing: {
position: 'absolute',
width: 140,
height: 140,
borderRadius: 70,
backgroundColor: colors.primary + '30',
},
iconBackground: {
width: 120,
height: 120,
borderRadius: 60,
backgroundColor: colors.surface,
justifyContent: 'center',
alignItems: 'center',
shadowColor: colors.primary,
shadowOffset: { width: 0, height: 0 },
shadowOpacity: 0.5,
shadowRadius: 20,
elevation: 10,
},
title: {
fontSize: 28,
fontWeight: 'bold',
color: colors.text,
marginBottom: spacing.md,
textAlign: 'center',
},
subtitle: {
fontSize: 16,
color: colors.textSecondary,
textAlign: 'center',
lineHeight: 24,
marginBottom: spacing.xl,
},
features: {
width: '100%',
marginBottom: spacing.xxl,
},
featureItem: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.surface,
padding: spacing.md,
borderRadius: 12,
marginBottom: spacing.sm,
},
featureText: {
color: colors.text,
marginLeft: spacing.md,
fontSize: 15,
fontWeight: '500',
},
buttonContainer: {
width: '100%',
},
button: {
width: '100%',
marginBottom: spacing.md,
},
skipButton: {
padding: spacing.md,
alignItems: 'center',
},
skipText: {
color: colors.textSecondary,
fontSize: 16,
fontWeight: '500',
},
});

export default LocationPermissionScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/auth/LocationPermissionScreen.tsx", "w") as f:
f.write(location_permission_screen)
