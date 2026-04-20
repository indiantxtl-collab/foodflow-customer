phone_input_screen = '''import React, { useState, useRef } from 'react';
import {
View,
Text,
StyleSheet,
TouchableOpacity,
StatusBar,
KeyboardAvoidingView,
Platform,
ScrollView,
} from 'react-native';
import CountryPicker, { CountryCode, Country } from 'react-native-country-picker-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
useSharedValue,
useAnimatedStyle,
withSpring,
withSequence,
} from 'react-native-reanimated';

import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { CustomInput } from '../../components/ui/CustomInput';
import { GradientButton } from '../../components/ui/GradientButton';
import { GlassCard } from '../../components/ui/GlassCard';
import api, { endpoints } from '../../constants/api';
import { showMessage } from 'react-native-flash-message';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const PhoneInputScreen = () => {
const [phone, setPhone] = useState('');
const [countryCode, setCountryCode] = useState<CountryCode>('IN');
const [callingCode, setCallingCode] = useState('91');
const [showCountryPicker, setShowCountryPicker] = useState(false);
const [loading, setLoading] = useState(false);
const navigation = useNavigation();

const buttonScale = useSharedValue(1);

const handleSelectCountry = (country: Country) => {
setCountryCode(country.cca2);
setCallingCode(country.callingCode[0]);
setShowCountryPicker(false);
};

const handleGetOTP = async () => {
if (phone.length < 10) {
showMessage({
message: 'Invalid Phone Number',
description: 'Please enter a valid 10-digit phone number',
type: 'warning',
});
return;
}

try {  
  setLoading(true);  
    
  // Animate button  
  buttonScale.value = withSequence(  
    withSpring(0.95, { damping: 10 }),  
    withSpring(1, { damping: 10 })  
  );  

  const response = await api.post(endpoints.auth.sendOTP, {  
    phone,  
    countryCode: `+${callingCode}`,  
  });  

  if (response.data.success) {  
    showMessage({  
      message: 'OTP Sent!',  
      description: `Verification code sent to +${callingCode} ${phone}`,  
      type: 'success',  
    });  

    navigation.navigate('OTP' as never, {  
      phone,  
      countryCode: `+${callingCode}`,  
    } as never);  
  }  
} catch (error: any) {  
  showMessage({  
    message: 'Error',  
    description: error.response?.data?.message || 'Failed to send OTP',  
    type: 'danger',  
  });  
} finally {  
  setLoading(false);  
}

};

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
    <ScrollView  
      contentContainerStyle={styles.scrollContent}  
      keyboardShouldPersistTaps="handled"  
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
        <Text style={styles.title}>Enter Your Phone</Text>  
        <Text style={styles.subtitle}>  
          We'll send you a verification code to confirm your identity  
        </Text>  
      </View>  

      {/* Phone Input Card */}  
      <GlassCard style={styles.card} intensity="high">  
        <Text style={styles.label}>Phone Number</Text>  
          
        <View style={styles.phoneInputContainer}>  
          {/* Country Code Selector */}  
          <AnimatedTouchable  
            style={styles.countrySelector}  
            onPress={() => setShowCountryPicker(true)}  
            activeOpacity={0.8}  
          >  
            <CountryPicker  
              countryCode={countryCode}  
              withFilter  
              withFlag  
              withCallingCode  
              withEmoji  
              onSelect={handleSelectCountry}  
              visible={showCountryPicker}  
              onClose={() => setShowCountryPicker(false)}  
              theme={{  
                backgroundColor: colors.backgroundLight,  
                onBackgroundTextColor: colors.text,  
              }}  
            />  
            <Text style={styles.callingCode}>+{callingCode}</Text>  
            <Icon name="chevron-down" size={16} color={colors.textSecondary} />  
          </AnimatedTouchable>  

          {/* Phone Number Input */}  
          <View style={styles.inputWrapper}>  
            <CustomInput  
              placeholder="99999 99999"  
              value={phone}  
              onChangeText={setPhone}  
              keyboardType="phone-pad"  
              maxLength={10}  
              containerStyle={styles.phoneInput}  
            />  
          </View>  
        </View>  

        <Text style={styles.hint}>  
          <Icon name="shield-checkmark" size={14} color={colors.success} />  
          {' '}Your number is secure and will not be shared  
        </Text>  
      </GlassCard>  

      {/* Get OTP Button */}  
      <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>  
        <GradientButton  
          title="Get OTP"  
          onPress={handleGetOTP}  
          loading={loading}  
          size="large"  
          style={styles.button}  
        />  
      </Animated.View>  

      {/* Terms */}  
      <Text style={styles.terms}>  
        By continuing, you agree to our{' '}  
        <Text style={styles.termsLink}>Terms of Service</Text>  
        {' '}and{' '}  
        <Text style={styles.termsLink}>Privacy Policy</Text>  
      </Text>  
    </ScrollView>  
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
},
scrollContent: {
flexGrow: 1,
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
card: {
marginBottom: spacing.xl,
},
label: {
fontSize: 14,
color: colors.textSecondary,
marginBottom: spacing.md,
fontWeight: '500',
},
phoneInputContainer: {
flexDirection: 'row',
alignItems: 'center',
gap: spacing.md,
},
countrySelector: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.surface,
borderRadius: borderRadius.md,
paddingHorizontal: spacing.md,
paddingVertical: 16,
gap: spacing.sm,
borderWidth: 1,
borderColor: colors.surfaceLight,
},
callingCode: {
color: colors.text,
fontSize: 16,
fontWeight: '600',
},
inputWrapper: {
flex: 1,
},
phoneInput: {
marginBottom: 0,
},
hint: {
fontSize: 12,
color: colors.textMuted,
marginTop: spacing.md,
},
buttonContainer: {
marginTop: spacing.lg,
},
button: {
width: '100%',
},
terms: {
fontSize: 12,
color: colors.textMuted,
textAlign: 'center',
marginTop: spacing.xl,
lineHeight: 20,
},
termsLink: {
color: colors.primary,
fontWeight: '600',
},
});

export default PhoneInputScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/auth/PhoneInputScreen.tsx", "w") as f:
f.write(phone_input_screen)
