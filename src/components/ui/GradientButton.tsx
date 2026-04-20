gradient_button = '''import React from 'react';
import {
TouchableOpacity,
Text,
StyleSheet,
ViewStyle,
TextStyle,
ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
useSharedValue,
useAnimatedStyle,
withSpring,
withSequence,
} from 'react-native-reanimated';
import { colors, gradients, borderRadius } from '../constants/colors';

interface GradientButtonProps {
title: string;
onPress: () => void;
variant?: 'primary' | 'secondary' | 'outline';
size?: 'small' | 'medium' | 'large';
disabled?: boolean;
loading?: boolean;
style?: ViewStyle;
textStyle?: TextStyle;
icon?: React.ReactNode;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const GradientButton: React.FC<GradientButtonProps> = ({
title,
onPress,
variant = 'primary',
size = 'medium',
disabled = false,
loading = false,
style,
textStyle,
icon,
}) => {
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({
transform: [{ scale: scale.value }],
}));

const handlePressIn = () => {
scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
};

const handlePressOut = () => {
scale.value = withSpring(1, { damping: 15, stiffness: 300 });
};

const handlePress = () => {
if (!disabled && !loading) {
scale.value = withSequence(
withSpring(0.9, { damping: 10, stiffness: 400 }),
withSpring(1, { damping: 10, stiffness: 400 })
);
onPress();
}
};

const getSizeStyles = () => {
switch (size) {
case 'small':
return { paddingVertical: 8, paddingHorizontal: 16 };
case 'large':
return { paddingVertical: 16, paddingHorizontal: 32 };
default:
return { paddingVertical: 12, paddingHorizontal: 24 };
}
};

const getTextSize = () => {
switch (size) {
case 'small':
return 14;
case 'large':
return 18;
default:
return 16;
}
};

if (variant === 'outline') {
return (
<AnimatedTouchable
onPress={handlePress}
onPressIn={handlePressIn}
onPressOut={handlePressOut}
activeOpacity={0.8}
style={[
styles.outlineButton,
getSizeStyles(),
animatedStyle,
style,
disabled && styles.disabled,
]}
disabled={disabled}
>
{loading ? (
<ActivityIndicator color={colors.primary} />
) : (
<>
{icon}
<Text
style={[
styles.outlineText,
{ fontSize: getTextSize() },
textStyle,
]}
>
{title}
</Text>
</>
)}
</AnimatedTouchable>
);
}

const gradientColors = variant === 'primary' ? gradients.primary : gradients.secondary;

return (
<AnimatedTouchable
onPress={handlePress}
onPressIn={handlePressIn}
onPressOut={handlePressOut}
activeOpacity={0.9}
style={[styles.container, animatedStyle, style]}
disabled={disabled}
>
<LinearGradient
colors={gradientColors}
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 0 }}
style={[styles.gradient, getSizeStyles(), disabled && styles.disabled]}
>
{loading ? (
<ActivityIndicator color={colors.text} />
) : (
<>
{icon}
<Text
style={[
styles.text,
{ fontSize: getTextSize() },
textStyle,
]}
>
{title}
</Text>
</>
)}
</LinearGradient>
</AnimatedTouchable>
);
};

const styles = StyleSheet.create({
container: {
borderRadius: borderRadius.lg,
overflow: 'hidden',
},
gradient: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
gap: 8,
},
text: {
color: colors.text,
fontWeight: '700',
letterSpacing: 0.5,
},
outlineButton: {
borderWidth: 2,
borderColor: colors.primary,
borderRadius: borderRadius.lg,
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
gap: 8,
},
outlineText: {
color: colors.primary,
fontWeight: '700',
letterSpacing: 0.5,
},
disabled: {
opacity: 0.5,
},
});
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/components/ui/GradientButton.tsx", "w") as f:
f.write(gradient_button)
