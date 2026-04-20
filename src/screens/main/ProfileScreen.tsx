profile_screen = '''import React from 'react';
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAuthStore } from '../../store/authStore';
import { showMessage } from 'react-native-flash-message';

const menuItems = [
{ id: 'addresses', label: 'My Addresses', icon: 'location-outline' },
{ id: 'payments', label: 'Payment Methods', icon: 'card-outline' },
{ id: 'orders', label: 'Order History', icon: 'time-outline' },
{ id: 'favorites', label: 'Favorites', icon: 'heart-outline' },
{ id: 'help', label: 'Help & Support', icon: 'help-circle-outline' },
{ id: 'settings', label: 'Settings', icon: 'settings-outline' },
];

const ProfileScreen = () => {
const navigation = useNavigation();
const { user, logout } = useAuthStore();

const handleMenuPress = (id) => {
switch (id) {
case 'addresses':
showMessage({ message: 'Addresses', type: 'info' });
break;
case 'orders':
navigation.navigate('Orders' as never);
break;
default:
showMessage({ message: ${id} coming soon!, type: 'info' });
}
};

const handleLogout = async () => {
await logout();
showMessage({
message: 'Logged Out',
description: 'See you soon!',
type: 'success',
});
};

return (
<View style={styles.container}>
{/* Header */}
<View style={styles.header}>
<Text style={styles.headerTitle}>Profile</Text>
<TouchableOpacity>
<Icon name="create-outline" size={24} color={colors.text} />
</TouchableOpacity>
</View>

<ScrollView showsVerticalScrollIndicator={false}>  
    {/* Profile Card */}  
    <GlassCard style={styles.profileCard} intensity="high">  
      <View style={styles.profileInfo}>  
        <View style={styles.avatarContainer}>  
          <Image  
            source={{ uri: user?.avatar || 'https://via.placeholder.com/80' }}  
            style={styles.avatar}  
          />  
          <TouchableOpacity style={styles.editAvatarButton}>  
            <Icon name="camera" size={16} color={colors.text} />  
          </TouchableOpacity>  
        </View>  
        <View style={styles.userInfo}>  
          <Text style={styles.userName}>{user?.name}</Text>  
          <Text style={styles.userPhone}>{user?.phone}</Text>  
          <Text style={styles.userEmail}>{user?.email || 'No email added'}</Text>  
        </View>  
      </View>  
    </GlassCard>  

    {/* Stats */}  
    <View style={styles.statsContainer}>  
      <View style={styles.statItem}>  
        <Text style={styles.statValue}>12</Text>  
        <Text style={styles.statLabel}>Orders</Text>  
      </View>  
      <View style={styles.statDivider} />  
      <View style={styles.statItem}>  
        <Text style={styles.statValue}>₹2.4k</Text>  
        <Text style={styles.statLabel}>Spent</Text>  
      </View>  
      <View style={styles.statDivider} />  
      <View style={styles.statItem}>  
        <Text style={styles.statValue}>4</Text>  
        <Text style={styles.statLabel}>Favorites</Text>  
      </View>  
    </View>  

    {/* Menu */}  
    <View style={styles.menuContainer}>  
      {menuItems.map((item) => (  
        <TouchableOpacity  
          key={item.id}  
          style={styles.menuItem}  
          onPress={() => handleMenuPress(item.id)}  
        >  
          <View style={styles.menuIcon}>  
            <Icon name={item.icon} size={22} color={colors.primary} />  
          </View>  
          <Text style={styles.menuLabel}>{item.label}</Text>  
          <Icon name="chevron-forward" size={20} color={colors.textMuted} />  
        </TouchableOpacity>  
      ))}  
    </View>  

    {/* Logout */}  
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>  
      <Icon name="log-out-outline" size={22} color={colors.error} />  
      <Text style={styles.logoutText}>Logout</Text>  
    </TouchableOpacity>  

    {/* App Version */}  
    <Text style={styles.versionText}>FoodFlow v1.0.0</Text>  
  </ScrollView>  
</View>

);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingTop: 60,
paddingHorizontal: spacing.lg,
paddingBottom: spacing.md,
},
headerTitle: {
fontSize: 28,
fontWeight: 'bold',
color: colors.text,
},
profileCard: {
marginHorizontal: spacing.lg,
marginBottom: spacing.lg,
},
profileInfo: {
flexDirection: 'row',
alignItems: 'center',
},
avatarContainer: {
position: 'relative',
},
avatar: {
width: 80,
height: 80,
borderRadius: 40,
borderWidth: 3,
borderColor: colors.primary,
},
editAvatarButton: {
position: 'absolute',
bottom: 0,
right: 0,
width: 28,
height: 28,
borderRadius: 14,
backgroundColor: colors.primary,
justifyContent: 'center',
alignItems: 'center',
borderWidth: 2,
borderColor: colors.background,
},
userInfo: {
marginLeft: spacing.md,
flex: 1,
},
userName: {
fontSize: 20,
fontWeight: 'bold',
color: colors.text,
marginBottom: 4,
},
userPhone: {
fontSize: 14,
color: colors.textSecondary,
marginBottom: 2,
},
userEmail: {
fontSize: 13,
color: colors.textMuted,
},
statsContainer: {
flexDirection: 'row',
justifyContent: 'space-around',
backgroundColor: colors.surface,
marginHorizontal: spacing.lg,
borderRadius: borderRadius.lg,
padding: spacing.md,
marginBottom: spacing.lg,
},
statItem: {
alignItems: 'center',
flex: 1,
},
statValue: {
fontSize: 20,
fontWeight: 'bold',
color: colors.primary,
marginBottom: 4,
},
statLabel: {
fontSize: 12,
color: colors.textSecondary,
},
statDivider: {
width: 1,
backgroundColor: colors.surfaceLight,
},
menuContainer: {
backgroundColor: colors.surface,
marginHorizontal: spacing.lg,
borderRadius: borderRadius.lg,
overflow: 'hidden',
},
menuItem: {
flexDirection: 'row',
alignItems: 'center',
padding: spacing.md,
borderBottomWidth: 1,
borderBottomColor: colors.surfaceLight,
},
menuIcon: {
width: 40,
height: 40,
borderRadius: 20,
backgroundColor: colors.primary + '20',
justifyContent: 'center',
alignItems: 'center',
marginRight: spacing.md,
},
menuLabel: {
flex: 1,
fontSize: 16,
color: colors.text,
},
logoutButton: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
backgroundColor: colors.error + '10',
marginHorizontal: spacing.lg,
marginTop: spacing.lg,
padding: spacing.md,
borderRadius: borderRadius.lg,
gap: spacing.sm,
},
logoutText: {
color: colors.error,
fontSize: 16,
fontWeight: '600',
},
versionText: {
textAlign: 'center',
color: colors.textMuted,
fontSize: 12,
marginTop: spacing.xl,
marginBottom: spacing.xxl,
},
});

export default ProfileScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/main/ProfileScreen.tsx", "w") as f:
f.write(profile_screen)
