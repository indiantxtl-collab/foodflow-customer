glass_card = '''import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../../constants/colors';

interface GlassCardProps {
children: React.ReactNode;
style?: ViewStyle;
intensity?: 'low' | 'medium' | 'high';
}

export const GlassCard: React.FC<GlassCardProps> = ({
children,
style,
intensity = 'medium',
}) => {
const getIntensity = () => {
switch (intensity) {
case 'low':
return { backgroundColor: 'rgba(255,255,255,0.03)' };
case 'high':
return { backgroundColor: 'rgba(255,255,255,0.1)' };
default:
return { backgroundColor: colors.glass.background };
}
};

return (
<View style={[styles.container, getIntensity(), style]}>
{children}
</View>
);
};

const styles = StyleSheet.create({
container: {
borderRadius: borderRadius.lg,
borderWidth: 1,
borderColor: colors.glass.border,
padding: 16,
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.2,
shadowRadius: 8,
elevation: 5,
},
});
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/components/ui/GlassCard.tsx", "w") as f:
f.write(glass_card)
