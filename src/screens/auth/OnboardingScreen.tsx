onboarding_screen = '''import React, { useState, useRef, useEffect } from 'react';
import {
View,
Text,
StyleSheet,
Dimensions,
FlatList,
Animated,
TouchableOpacity,
StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { GradientButton } from '../../components/ui/GradientButton';

const { width, height } = Dimensions.get('window');

const slides = [
{
id: '1',
title: 'Discover Restaurants',
subtitle: 'Find the best restaurants near you with a wide variety of cuisines and flavors.',
icon: '🍽️',
colors: ['#FF6B35', '#FF8F6B'],
},
{
id: '2',
title: 'Fast Delivery',
subtitle: 'Get your food delivered hot and fresh within minutes by our super-fast delivery partners.',
icon: '🚀',
colors: ['#4ECDC4', '#44A08D'],
},
{
id: '3',
title: 'Live Order Tracking',
subtitle: 'Track your order in real-time from the restaurant to your doorstep.',
icon: '📍',
colors: ['#667eea', '#764ba2'],
},
{
id: '4',
title: 'Best Offers & Cashback',
subtitle: 'Enjoy exclusive deals, discounts, and cashback on every order you place.',
icon: '🎁',
colors: ['#f093fb', '#f5576c'],
},
];

const OnboardingScreen = () => {
const [currentIndex, setCurrentIndex] = useState(0);
const navigation = useNavigation();
const flatListRef = useRef<FlatList>(null);
const scrollX = useRef(new Animated.Value(0)).current;

const slideAnimations = slides.map(() => ({
translateX: useRef(new Animated.Value(width)).current,
opacity: useRef(new Animated.Value(0)).current,
scale: useRef(new Animated.Value(0.8)).current,
}));

useEffect(() => {
// Animate first slide in
animateSlide(0, true);
}, []);

const animateSlide = (index: number, isEntering: boolean) => {
const anim = slideAnimations[index];
const toValue = isEntering ? 0 : -width;
const opacityValue = isEntering ? 1 : 0;
const scaleValue = isEntering ? 1 : 0.8;

Animated.parallel([  
  Animated.spring(anim.translateX, {  
    toValue,  
    useNativeDriver: true,  
    friction: 8,  
    tension: 40,  
  }),  
  Animated.timing(anim.opacity, {  
    toValue: opacityValue,  
    duration: 500,  
    useNativeDriver: true,  
  }),  
  Animated.spring(anim.scale, {  
    toValue: scaleValue,  
    useNativeDriver: true,  
    friction: 8,  
  }),  
]).start();

};

const handleNext = () => {
if (currentIndex < slides.length - 1) {
// Animate current slide out
animateSlide(currentIndex, false);

const nextIndex = currentIndex + 1;  
  flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });  
  setCurrentIndex(nextIndex);  
    
  // Animate next slide in  
  setTimeout(() => animateSlide(nextIndex, true), 100);  
} else {  
  navigation.navigate('PhoneInput' as never);  
}

};

const handleSkip = () => {
navigation.navigate('PhoneInput' as never);
};

const renderSlide = ({ item, index }: { item: typeof slides[0]; index: number }) => {
const anim = slideAnimations[index];

return (  
  <View style={styles.slide}>  
    <Animated.View  
      style={[  
        styles.iconContainer,  
        {  
          backgroundColor: item.colors[0] + '20',  
          transform: [  
            { translateX: anim.translateX },  
            { scale: anim.scale },  
          ],  
          opacity: anim.opacity,  
        },  
      ]}  
    >  
      <Text style={styles.icon}>{item.icon}</Text>  
      {/* Floating particles */}  
      <View style={[styles.particle, { top: 10, left: 10, backgroundColor: item.colors[0] }]} />  
      <View style={[styles.particle, { top: 20, right: 20, backgroundColor: item.colors[1] }]} />  
      <View style={[styles.particle, { bottom: 15, left: 30, backgroundColor: item.colors[0] }]} />  
    </Animated.View>  

    <Animated.View  
      style={{  
        transform: [{ translateX: anim.translateX }],  
        opacity: anim.opacity,  
      }}  
    >  
      <Text style={styles.title}>{item.title}</Text>  
      <Text style={styles.subtitle}>{item.subtitle}</Text>  
    </Animated.View>  
  </View>  
);

};

const renderDots = () => {
return (
<View style={styles.dotsContainer}>
{slides.map((_, index) => {
const inputRange = [
(index - 1) * width,
index * width,
(index + 1) * width,
];

const dotWidth = scrollX.interpolate({  
        inputRange,  
        outputRange: [8, 24, 8],  
        extrapolate: 'clamp',  
      });  

      const dotOpacity = scrollX.interpolate({  
        inputRange,  
        outputRange: [0.3, 1, 0.3],  
        extrapolate: 'clamp',  
      });  

      const dotColor = scrollX.interpolate({  
        inputRange,  
        outputRange: [colors.textMuted, colors.primary, colors.textMuted],  
        extrapolate: 'clamp',  
      });  

      return (  
        <Animated.View  
          key={index}  
          style={[  
            styles.dot,  
            {  
              width: dotWidth,  
              opacity: dotOpacity,  
              backgroundColor: dotColor,  
            },  
          ]}  
        />  
      );  
    })}  
  </View>  
);

};

return (
<LinearGradient colors={gradients.dark} style={styles.container}>
<StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

{/* Skip Button */}  
  <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>  
    <Text style={styles.skipText}>Skip</Text>  
  </TouchableOpacity>  

  {/* Slides */}  
  <FlatList  
    ref={flatListRef}  
    data={slides}  
    renderItem={renderSlide}  
    keyExtractor={(item) => item.id}  
    horizontal  
    pagingEnabled  
    showsHorizontalScrollIndicator={false}  
    scrollEnabled={false}  
    onScroll={Animated.event(  
      [{ nativeEvent: { contentOffset: { x: scrollX } } }],  
      { useNativeDriver: false }  
    )}  
  />  

  {/* Bottom Section */}  
  <View style={styles.bottomContainer}>  
    {renderDots()}  

    <GradientButton  
      title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}  
      onPress={handleNext}  
      size="large"  
      style={styles.nextButton}  
    />  
  </View>  

  {/* Background Gradient Overlay */}  
  <LinearGradient  
    colors={['transparent', 'rgba(255,107,53,0.1)']}  
    style={styles.backgroundGradient}  
    pointerEvents="none"  
  />  
</LinearGradient>

);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
},
skipButton: {
position: 'absolute',
top: 60,
right: 24,
zIndex: 10,
padding: 8,
},
skipText: {
color: colors.textSecondary,
fontSize: 16,
fontWeight: '600',
},
slide: {
width,
flex: 1,
justifyContent: 'center',
alignItems: 'center',
paddingHorizontal: spacing.xl,
},
iconContainer: {
width: 180,
height: 180,
borderRadius: 90,
justifyContent: 'center',
alignItems: 'center',
marginBottom: spacing.xxl,
position: 'relative',
},
icon: {
fontSize: 80,
},
particle: {
position: 'absolute',
width: 8,
height: 8,
borderRadius: 4,
opacity: 0.6,
},
title: {
fontSize: 32,
fontWeight: 'bold',
color: colors.text,
textAlign: 'center',
marginBottom: spacing.md,
},
subtitle: {
fontSize: 16,
color: colors.textSecondary,
textAlign: 'center',
lineHeight: 24,
paddingHorizontal: spacing.lg,
},
bottomContainer: {
paddingHorizontal: spacing.xl,
paddingBottom: spacing.xxl,
alignItems: 'center',
},
dotsContainer: {
flexDirection: 'row',
marginBottom: spacing.xl,
},
dot: {
height: 8,
borderRadius: 4,
marginHorizontal: 4,
},
nextButton: {
width: '100%',
},
backgroundGradient: {
position: 'absolute',
bottom: 0,
left: 0,
right: 0,
height: height * 0.4,
},
});

export default OnboardingScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/auth/OnboardingScreen.tsx", "w") as f:
f.write(onboarding_screen)
