otp_screen = '''import React, { useState, useRef, useEffect } from 'react';
import {
View,
Text,
StyleSheet,
TouchableOpacity,
StatusBar,
KeyboardAvoidingView,
Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
useSharedValue,
useAnimatedStyle,
withSpring,
withSequence,
withTiming,
} from 'react-native-reanimated';

import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { GradientButton } from '../../components/ui/GradientButton';
import { GlassCard } from '../../components/ui/GlassCard';
import api, { endpoints } from '../../constants/api';
import { showMessage } from 'react-native-flash-message';
import { useAuthStore } from '../../store/authStore';

const OTP_LENGTH = 6;

const OTPScreen = () => {
const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
const [timer, setTimer] = useState(30);
const [loading, setLoading] = useState(false);
const inputRefs = useRef<(TextInput | null)[]>([]);
const navigation = useNavigation();
const route = useRoute();
const { phone, countryCode } = route.params as { phone: string; countryCode: string };
const { login } = useAuthStore();

const shake = useSharedValue(0);
const buttonScale = useSharedValue(1);

useEffect(() => {
// Focus first input
inputRefs.current[0]?.focus();

// Start timer  
const interval = setInterval(() => {  
  setTimer((prev) => {  
    if (prev <= 1) {  
      clearInterval(interval);  
      return 0;  
    }  
    return prev - 1;  
  });  
}, 1000);  

return () => clearInterval(interval);

}, []);

const handleChange = (text: string, index: number) => {
if (text.length > 1) {
text = text[0];
}

const newOtp = [...otp];  
newOtp[index] = text;  
setOtp(newOtp);  

// Move to next input  
if (text && index < OTP_LENGTH - 1) {  
  inputRefs.current[index + 1]?.focus();  
}

};

const handleKeyPress = (e: any, index: number) => {
if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
inputRefs.current[index - 1]?.focus();
}
};

const handleResend = async () => {
try {
setTimer(30);
const response = await api.post(endpoints.auth.sendOTP, {
phone,
countryCode,
});

if (response.data.success) {  
    showMessage({  
      message: 'OTP Resent',  
      description: 'New verification code sent',  
      type: 'success',  
    });  
  }  
} catch (error: any) {  
  showMessage({  
    message: 'Error',  
    description: error.response?.data?.message || 'Failed to resend OTP',  
    type: 'danger',  
  });  
}

};

const handleVerify = async () => {
const otpString = otp.join('');

if (otpString.length !== OTP_LENGTH) {  
  // Shake animation  
  shake.value = withSequence(  
    withTiming(-10, { duration: 50 }),  
    withTiming(10, { duration: 50 }),  
    withTiming(-10, { duration: 50 }),  
    withTiming(10, { duration: 50 }),  
    withTiming(0, { duration: 50 })  
  );  
    
  showMessage({  
    message: 'Invalid OTP',  
    description: 'Please enter the complete 6-digit code',  
    type: 'warning',  
  });  
  return;  
}  

try {  
  setLoading(true);  
  buttonScale.value = withSpring(0.95, { damping: 10 });  

  // Verify OTP  
  const verifyResponse = await api.post(endpoints.auth.verifyOTP, {  
    phone,  
    otp: otpString,  
    countryCode,  
  });  

  if (verifyResponse.data.status === 'approved') {  
    const fullPhone = `${countryCode}${phone}`;  
      
    if (verifyResponse.data.isNewUser) {  
      // Navigate to name input for new users  
      navigation.navigate('NameInput' as never, { phone: fullPhone } as never);  
    } else {  
      // Login existing user  
      await login(phone, otpString);  
      showMessage({  
        message: 'Welcome Back!',  
        type: 'success',  
      });  
    }  
  }  
} catch (error: any) {  
  buttonScale.value = withSpring(1, { damping: 10 });  
  showMessage({  
    message: 'Verification Failed',  
    description: error.response?.data?.message || 'Invalid OTP',  
    type: 'danger',  
  });  
} finally {  
  setLoading(false);  
}

};

const animatedContainerStyle = useAnimatedStyle(() => ({
transform: [{ translateX: shake.value }],
}));

const animatedButtonStyle = useAnimatedStyle(() => ({
transform: [{ scale: buttonScale.value }],
}));

return (
<LinearGradient colors={gradients.dark} style={styles.container}>
<StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

<KeyboardAvoidingView  
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  
    style={styles.keyboardView}  
  >  
    {/* Back Button */}  
    <TouchableOpacity  
      style={styles.backButton}  
      onPress={() => navigation.goBack()}  
    >  
      <Icon name="arrow-back" size={24} color={colors.text} />  
    </TouchableOpacity>  

    {/* Header */}  
    <View style={styles.header}>  
      <Text style={styles.title}>Enter OTP</Text>  
      <Text style={styles.subtitle}>  
        Enter the 6-digit code sent to{'\n'}  
        <Text style={styles.phoneText}>{countryCode} {phone}</Text>  
      </Text>  
    </View>  

    {/* OTP Input */}  
    <GlassCard style={styles.card}>  
      <Animated.View style={[styles.otpContainer, animatedContainerStyle]}>  
        {otp.map((digit, index) => (  
          <View key={index} style={styles.inputWrapper}>  
            <TextInput  
              ref={(ref) => (inputRefs.current[index] = ref)}  
              style={[  
                styles.otpInput,  
                digit && styles.otpInputFilled,  
              ]}  
              value={digit}  
              onChangeText={(text) => handleChange(text, index)}  
              onKeyPress={(e) => handleKeyPress(e, index)}  
              keyboardType="number-pad"  
              maxLength={1}  
              selectTextOnFocus  
            />  
            {digit && <View style={styles.filledIndicator} />}  
          </View>  
        ))}  
      </Animated.View>  

      {/* Resend Timer */}  
      <View style={styles.resendContainer}>  
        {timer > 0 ? (  
          <Text style={styles.timerText}>  
            Resend code in <Text style={styles.timerHighlight}>{timer}s</Text>  
          </Text>  
        ) : (  
          <TouchableOpacity onPress={handleResend}>  
            <Text style={styles.resendText}>Resend OTP</Text>  
          </TouchableOpacity>  
        )}  
      </View>  
    </GlassCard>  

    {/* Verify Button */}  
    <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>  
      <GradientButton  
        title="Verify OTP"  
        onPress={handleVerify}  
        loading={loading}  
        size="large"  
        style={styles.button}  
      />  
    </Animated.View>  

    {/* Help Text */}  
    <Text style={styles.helpText}>  
      Didn't receive the code?{' '}  
      <Text style={styles.helpLink}>Get help</Text>  
    </Text>  
  </KeyboardAvoidingView>  
</LinearGradient>

);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
},
keyboardView: {
flex: 1,
padding: spacing.xl,
paddingTop: 60,
},
backButton: {
width: 44,
height: 44,
borderRadius: 22,
backgroundColor: colors.surface,
justifyContent: 'center',
alignItems: 'center',
marginBottom: spacing.xl,
},
header: {
marginBottom: spacing.xxl,
},
title: {
fontSize: 32,
fontWeight: 'bold',
color: colors.text,
marginBottom: spacing.sm,
},
subtitle: {
fontSize: 16,
color: colors.textSecondary,
lineHeight: 24,
},
phoneText: {
color: colors.primary,
fontWeight: '600',
},
card: {
marginBottom: spacing.xl,
alignItems: 'center',
},
otpContainer: {
flexDirection: 'row',
justifyContent: 'center',
gap: spacing.sm,
marginBottom: spacing.lg,
},
inputWrapper: {
position: 'relative',
},
otpInput: {
width: 48,
height: 56,
backgroundColor: colors.surface,
borderRadius: borderRadius.md,
borderWidth: 1.5,
borderColor: colors.surfaceLight,
color: colors.text,
fontSize: 24,
fontWeight: 'bold',
textAlign: 'center',
},
otpInputFilled: {
borderColor: colors.primary,
backgroundColor: colors.primary + '10',
},
filledIndicator: {
position: 'absolute',
bottom: -8,
left: '50%',
marginLeft: -4,
width: 8,
height: 8,
borderRadius: 4,
backgroundColor: colors.primary,
},
resendContainer: {
marginTop: spacing.md,
},
timerText: {
color: colors.textSecondary,
fontSize: 14,
},
timerHighlight: {
color: colors.primary,
fontWeight: '600',
},
resendText: {
color: colors.primary,
fontWeight: '600',
fontSize: 14,
},
buttonContainer: {
marginTop: spacing.lg,
},
button: {
width: '100%',
},
helpText: {
textAlign: 'center',
marginTop: spacing.xl,
color: colors.textMuted,
fontSize: 14,
},
helpLink: {
color: colors.primary,
fontWeight: '600',
},
});

export default OTPScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/auth/OTPScreen.tsx", "w") as f:
f.write(otp_screen)
