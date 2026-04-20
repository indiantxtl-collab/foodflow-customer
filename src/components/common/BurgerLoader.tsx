burger_loader = '''import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
useSharedValue,
useAnimatedStyle,
withRepeat,
withTiming,
withSequence,
Easing,
} from 'react-native-reanimated';
import { colors } from '../../constants/colors';

interface BurgerLoaderProps {
size?: number;
}

export const BurgerLoader: React.FC<BurgerLoaderProps> = ({ size = 80 }) => {
const rotation = useSharedValue(0);
const bounce = useSharedValue(0);
const scale = useSharedValue(1);

React.useEffect(() => {
rotation.value = withRepeat(
withTiming(360, { duration: 2000, easing: Easing.linear }),
-1,
false
);

bounce.value = withRepeat(  
  withSequence(  
    withTiming(-10, { duration: 300, easing: Easing.ease }),  
    withTiming(0, { duration: 300, easing: Easing.ease })  
  ),  
  -1,  
  true  
);  

scale.value = withRepeat(  
  withSequence(  
    withTiming(1.1, { duration: 300 }),  
    withTiming(1, { duration: 300 })  
  ),  
  -1,  
  true  
);

}, []);

const containerStyle = useAnimatedStyle(() => ({
transform: [
{ rotate: ${rotation.value}deg },
],
}));

const bounceStyle = useAnimatedStyle(() => ({
transform: [
{ translateY: bounce.value },
{ scale: scale.value },
],
}));

const bunColor = '#FF6B35';
const meatColor = '#8B4513';
const lettuceColor = '#22C55E';
const cheeseColor = '#FFD93D';
const tomatoColor = '#EF4444';

return (
<View style={[styles.container, { width: size, height: size }]}>
<Animated.View style={[styles.burgerContainer, containerStyle]}>
{/* Top Bun */}
<Animated.View
style={[
styles.topBun,
{ width: size * 0.8, height: size * 0.25, backgroundColor: bunColor },
bounceStyle,
]}
>
<View style={[styles.seed, { left: '20%', top: '30%' }]} />
<View style={[styles.seed, { left: '50%', top: '20%' }]} />
<View style={[styles.seed, { left: '70%', top: '40%' }]} />
</Animated.View>

{/* Lettuce */}  
    <View  
      style={[  
        styles.lettuce,  
        { width: size * 0.85, height: size * 0.08, backgroundColor: lettuceColor },  
      ]}  
    />  

    {/* Cheese */}  
    <View  
      style={[  
        styles.cheese,  
        { width: size * 0.82, height: size * 0.06, backgroundColor: cheeseColor },  
      ]}  
    />  

    {/* Tomato */}  
    <View  
      style={[  
        styles.tomato,  
        { width: size * 0.75, height: size * 0.08, backgroundColor: tomatoColor },  
      ]}  
    />  

    {/* Meat */}  
    <View  
      style={[  
        styles.meat,  
        { width: size * 0.8, height: size * 0.12, backgroundColor: meatColor },  
      ]}  
    />  

    {/* Bottom Bun */}  
    <View  
      style={[  
        styles.bottomBun,  
        { width: size * 0.8, height: size * 0.15, backgroundColor: bunColor },  
      ]}  
    />  
  </Animated.View>  
</View>

);
};

const styles = StyleSheet.create({
container: {
justifyContent: 'center',
alignItems: 'center',
},
burgerContainer: {
alignItems: 'center',
justifyContent: 'center',
},
topBun: {
borderTopLeftRadius: 40,
borderTopRightRadius: 40,
borderBottomLeftRadius: 8,
borderBottomRightRadius: 8,
position: 'relative',
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.3,
shadowRadius: 3,
elevation: 5,
},
seed: {
position: 'absolute',
width: 4,
height: 4,
backgroundColor: '#FFE4C4',
borderRadius: 2,
},
lettuce: {
borderRadius: 4,
marginTop: -2,
shadowColor: '#000',
shadowOffset: { width: 0, height: 1 },
shadowOpacity: 0.2,
elevation: 3,
},
cheese: {
borderRadius: 3,
marginTop: -1,
},
tomato: {
borderRadius: 4,
marginTop: -1,
},
meat: {
borderRadius: 6,
marginTop: -1,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.3,
elevation: 4,
},
bottomBun: {
borderBottomLeftRadius: 20,
borderBottomRightRadius: 20,
borderTopLeftRadius: 6,
borderTopRightRadius: 6,
marginTop: -1,
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.3,
elevation: 5,
},
});
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/components/common/BurgerLoader.tsx", "w") as f:
f.write(burger_loader)
