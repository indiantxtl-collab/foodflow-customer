custom_input = '''import React, { useState } from 'react';
import {
View,
TextInput,
Text,
StyleSheet,
TextInputProps,
ViewStyle,
} from 'react-native';
import Animated, {
useSharedValue,
useAnimatedStyle,
withSpring,
} from 'react-native-reanimated';
import { colors, borderRadius } from '../../constants/colors';

interface CustomInputProps extends TextInputProps {
label?: string;
error?: string;
containerStyle?: ViewStyle;
leftIcon?: React.ReactNode;
rightIcon?: React.ReactNode;
}

export const CustomInput: React.FC<CustomInputProps> = ({
label,
error,
containerStyle,
leftIcon,
rightIcon,
onFocus,
onBlur,
...textInputProps
}) => {
const [isFocused, setIsFocused] = useState(false);
const borderColor = useSharedValue(colors.surfaceLight);
const scale = useSharedValue(1);

const animatedContainerStyle = useAnimatedStyle(() => ({
borderColor: borderColor.value,
transform: [{ scale: scale.value }],
}));

const handleFocus = (e: any) => {
setIsFocused(true);
borderColor.value = withSpring(colors.primary, { damping: 15 });
scale.value = withSpring(1.02, { damping: 15 });
onFocus?.(e);
};

const handleBlur = (e: any) => {
setIsFocused(false);
borderColor.value = withSpring(colors.surfaceLight, { damping: 15 });
scale.value = withSpring(1, { damping: 15 });
onBlur?.(e);
};

return (
<View style={[styles.container, containerStyle]}>
{label && <Text style={styles.label}>{label}</Text>}
<Animated.View
style={[
styles.inputContainer,
animatedContainerStyle,
error && styles.errorBorder,
]}
>
{leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
<TextInput
style={[styles.input, leftIcon && styles.inputWithLeftIcon]}
placeholderTextColor={colors.textMuted}
onFocus={handleFocus}
onBlur={handleBlur}
{...textInputProps}
/>
{rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
</Animated.View>
{error && <Text style={styles.errorText}>{error}</Text>}
</View>
);
};

const styles = StyleSheet.create({
container: {
marginBottom: 16,
},
label: {
color: colors.textSecondary,
fontSize: 14,
marginBottom: 8,
fontWeight: '500',
},
inputContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.surface,
borderRadius: borderRadius.md,
borderWidth: 1.5,
paddingHorizontal: 16,
height: 56,
},
input: {
flex: 1,
color: colors.text,
fontSize: 16,
fontWeight: '500',
},
inputWithLeftIcon: {
marginLeft: 12,
},
leftIcon: {
marginRight: 4,
},
rightIcon: {
marginLeft: 4,
},
errorBorder: {
borderColor: colors.error,
},
errorText: {
color: colors.error,
fontSize: 12,
marginTop: 4,
},
});
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/components/ui/CustomInput.tsx", "w") as f:
f.write(custom_input)
