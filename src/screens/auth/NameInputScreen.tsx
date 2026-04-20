name_input_screen = '''import React, { useState } from 'react';
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
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { colors, gradients, spacing } from '../../constants/colors';
import { CustomInput } from '../../components/ui/CustomInput';
import { GradientButton } from '../../components/ui/GradientButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAuthStore } from '../../store/authStore';
import { showMessage } from 'react-native-flash-message';

const NameInputScreen = () => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);
const navigation = useNavigation();
const route = useRoute();
const { phone } = route.params as { phone: string };
const { register } = useAuthStore();

const buttonScale = useSharedValue(1);

const handleCreateAccount = async () => {
if (name.trim().length < 2) {
showMessage({
message: 'Invalid Name',
description: 'Please enter your full name',
type: 'warning',
});
return;
}

try {  
  setLoading(true);  
  buttonScale.value = withSpring(0.95, { damping: 10 });  

  await register({  
    phone,  
    name: name.trim(),  
    email: email.trim() || undefined,  
  });  

  showMessage({  
    message: 'Account Created!',  
    description: 'Welcome to FoodFlow',  
    type: 'success',  
  });  

  // Navigate to location permission  
  navigation.navigate('LocationPermission' as never);  
} catch (error: any) {  
  buttonScale.value = withSpring(1, { damping: 10 });  
  showMessage({  
    message: 'Error',  
    description: error.response?.data?.message || 'Failed to create account',  
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
    {/* Back Button */}  
    <TouchableOpacity  
      style={styles.backButton}  
      onPress={() => navigation.goBack()}  
    >  
      <Icon name="arrow-back" size={24} color={colors.text} />  
    </TouchableOpacity>  

    {/* Header */}  
    <View style={styles.header}>  
      <Text style={styles.title}>Create Account</Text>  
      <Text style={styles.subtitle}>  
        Just a few more details to get you started  
      </Text>  
    </View>  

    {/* Form */}  
    <GlassCard style={styles.card}>  
      <CustomInput  
        label="Full Name *"  
        placeholder="John Doe"  
        value={name}  
        onChangeText={setName}  
        leftIcon={<Icon name="person-outline" size={20} color={colors.textMuted} />}  
        autoFocus  
      />  

      <CustomInput  
        label="Email (Optional)"  
        placeholder="john@example.com"  
        value={email}  
        onChangeText={setEmail}  
        keyboardType="email-address"  
        autoCapitalize="none"  
        leftIcon={<Icon name="mail-outline" size={20} color={colors.textMuted} />}  
      />  
    </GlassCard>  

    {/* Create Button */}  
    <Animated.View style={[styles.buttonContainer, animatedButtonStyle]}>  
      <GradientButton  
        title="Create Account"  
        onPress={handleCreateAccount}  
        loading={loading}  
        size="large"  
        style={styles.button}  
      />  
    </Animated.View>  
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
card: {
marginBottom: spacing.xl,
},
buttonContainer: {
marginTop: spacing.lg,
},
button: {
width: '100%',
},
});

export default NameInputScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/auth/NameInputScreen.tsx", "w") as f:
f.write(name_input_screen)
