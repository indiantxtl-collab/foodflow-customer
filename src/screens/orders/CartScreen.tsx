cart_screen = '''import React, { useState } from 'react';
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
import { GradientButton } from '../../components/ui/GradientButton';
import { useCartStore } from '../../store/cartStore';
import { showMessage } from 'react-native-flash-message';

const CartScreen = () => {
const navigation = useNavigation();
const {
items,
restaurant,
subtotal,
total,
updateQuantity,
removeItem,
clearCart,
coupon,
applyCoupon,
removeCoupon,
} = useCartStore();

const [couponCode, setCouponCode] = useState('');
const deliveryFee = restaurant?.deliveryFee || 0;
const platformFee = 5;
const tax = Math.round(subtotal() * 0.05);
const discount = coupon?.discount || 0;

if (items.length === 0) {
return (
<View style={[styles.container, styles.emptyContainer]}>
<Icon name="cart-outline" size={80} color={colors.textMuted} />
<Text style={styles.emptyTitle}>Your Cart is Empty</Text>
<Text style={styles.emptySubtitle}>
Add some delicious food to get started
</Text>
<GradientButton
title="Browse Restaurants"
onPress={() => navigation.navigate('Home' as never)}
style={styles.browseButton}
/>
</View>
);
}

return (
<View style={styles.container}>
{/* Header */}
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Icon name="arrow-back" size={24} color={colors.text} />
</TouchableOpacity>
<Text style={styles.headerTitle}>My Cart</Text>
<TouchableOpacity onPress={clearCart}>
<Text style={styles.clearText}>Clear</Text>
</TouchableOpacity>
</View>

<ScrollView showsVerticalScrollIndicator={false}>  
    {/* Restaurant Info */}  
    <View style={styles.restaurantInfo}>  
      <Text style={styles.restaurantName}>{restaurant?.name}</Text>  
      <Text style={styles.deliveryTime}>Delivery in 30-45 min</Text>  
    </View>  

    {/* Cart Items */}  
    <View style={styles.itemsContainer}>  
      {items.map((item) => (  
        <GlassCard key={item.menuItemId} style={styles.cartItem} intensity="low">  
          <View style={styles.itemRow}>  
            <View style={styles.itemInfo}>  
              <Text style={styles.itemName}>{item.name}</Text>  
              <Text style={styles.itemPrice}>  
                ₹{item.price} × {item.quantity}  
              </Text>  
            </View>  
              
            <View style={styles.quantityControl}>  
              <TouchableOpacity  
                style={styles.quantityButton}  
                onPress={() => updateQuantity(item.menuItemId, item.quantity - 1)}  
              >  
                <Icon name="remove" size={18} color={colors.text} />  
              </TouchableOpacity>  
              <Text style={styles.quantityText}>{item.quantity}</Text>  
              <TouchableOpacity  
                style={styles.quantityButton}  
                onPress={() => updateQuantity(item.menuItemId, item.quantity + 1)}  
              >  
                <Icon name="add" size={18} color={colors.text} />  
              </TouchableOpacity>  
            </View>  
          </View>  
        </GlassCard>  
      ))}  
    </View>  

    {/* Bill Details */}  
    <GlassCard style={styles.billCard}>  
      <Text style={styles.billTitle}>Bill Details</Text>  
        
      <View style={styles.billRow}>  
        <Text style={styles.billLabel}>Item Total</Text>  
        <Text style={styles.billValue}>₹{subtotal().toFixed(0)}</Text>  
      </View>  
        
      <View style={styles.billRow}>  
        <Text style={styles.billLabel}>Delivery Fee</Text>  
        <Text style={styles.billValue}>₹{deliveryFee}</Text>  
      </View>  
        
      <View style={styles.billRow}>  
        <Text style={styles.billLabel}>Platform Fee</Text>  
        <Text style={styles.billValue}>₹{platformFee}</Text>  
      </View>  
        
      <View style={styles.billRow}>  
        <Text style={styles.billLabel}>GST (5%)</Text>  
        <Text style={styles.billValue}>₹{tax}</Text>  
      </View>  
        
      {discount > 0 && (  
        <View style={styles.billRow}>  
          <Text style={[styles.billLabel, styles.discountLabel]}>  
            Discount {coupon?.code && `(${coupon.code})`}  
          </Text>  
          <Text style={[styles.billValue, styles.discountValue]}>  
            -₹{discount}  
          </Text>  
        </View>  
      )}  
        
      <View style={styles.divider} />  
        
      <View style={styles.billRow}>  
        <Text style={styles.totalLabel}>To Pay</Text>  
        <Text style={styles.totalValue}>₹{total().toFixed(0)}</Text>  
      </View>  
    </GlassCard>  

    {/* Spacing for bottom button */}  
    <View style={{ height: 100 }} />  
  </ScrollView>  

  {/* Checkout Button */}  
  <View style={styles.checkoutContainer}>  
    <View style={styles.checkoutInfo}>  
      <Text style={styles.checkoutTotal}>₹{total().toFixed(0)}</Text>  
      <Text style={styles.checkoutDetails}>TOTAL</Text>  
    </View>  
    <GradientButton  
      title="Proceed to Checkout"  
      onPress={() => navigation.navigate('Checkout' as never)}  
      style={styles.checkoutButton}  
    />  
  </View>  
</View>

);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
},
emptyContainer: {
justifyContent: 'center',
alignItems: 'center',
padding: spacing.xl,
},
emptyTitle: {
fontSize: 24,
fontWeight: 'bold',
color: colors.text,
marginTop: spacing.lg,
},
emptySubtitle: {
fontSize: 16,
color: colors.textSecondary,
marginTop: spacing.sm,
marginBottom: spacing.xl,
},
browseButton: {
width: 200,
},
header: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal: spacing.lg,
paddingTop: 60,
paddingBottom: spacing.md,
},
headerTitle: {
fontSize: 20,
fontWeight: 'bold',
color: colors.text,
},
clearText: {
color: colors.error,
fontSize: 14,
fontWeight: '600',
},
restaurantInfo: {
paddingHorizontal: spacing.lg,
paddingVertical: spacing.md,
borderBottomWidth: 1,
borderBottomColor: colors.surfaceLight,
},
restaurantName: {
fontSize: 18,
fontWeight: 'bold',
color: colors.text,
},
deliveryTime: {
fontSize: 14,
color: colors.textSecondary,
marginTop: 4,
},
itemsContainer: {
padding: spacing.lg,
},
cartItem: {
marginBottom: spacing.md,
},
itemRow: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
},
itemInfo: {
flex: 1,
},
itemName: {
fontSize: 16,
fontWeight: '600',
color: colors.text,
marginBottom: 4,
},
itemPrice: {
fontSize: 14,
color: colors.textSecondary,
},
quantityControl: {
flexDirection: 'row',
alignItems: 'center',
gap: spacing.sm,
},
quantityButton: {
width: 32,
height: 32,
borderRadius: 16,
backgroundColor: colors.surfaceLight,
justifyContent: 'center',
alignItems: 'center',
},
quantityText: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
minWidth: 24,
textAlign: 'center',
},
billCard: {
marginHorizontal: spacing.lg,
marginBottom: spacing.lg,
},
billTitle: {
fontSize: 18,
fontWeight: 'bold',
color: colors.text,
marginBottom: spacing.md,
},
billRow: {
flexDirection: 'row',
justifyContent: 'space-between',
marginBottom: spacing.sm,
},
billLabel: {
fontSize: 14,
color: colors.textSecondary,
},
billValue: {
fontSize: 14,
color: colors.text,
fontWeight: '500',
},
discountLabel: {
color: colors.success,
},
discountValue: {
color: colors.success,
},
divider: {
height: 1,
backgroundColor: colors.surfaceLight,
marginVertical: spacing.md,
},
totalLabel: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
},
totalValue: {
fontSize: 18,
fontWeight: 'bold',
color: colors.primary,
},
checkoutContainer: {
position: 'absolute',
bottom: 0,
left: 0,
right: 0,
backgroundColor: colors.backgroundLight,
flexDirection: 'row',
padding: spacing.lg,
paddingBottom: spacing.lg + 20,
borderTopWidth: 1,
borderTopColor: colors.surfaceLight,
},
checkoutInfo: {
flex: 1,
justifyContent: 'center',
},
checkoutTotal: {
fontSize: 20,
fontWeight: 'bold',
color: colors.text,
},
checkoutDetails: {
fontSize: 12,
color: colors.textSecondary,
},
checkoutButton: {
flex: 2,
},
});

export default CartScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/orders/CartScreen.tsx", "w") as f:
f.write(cart_screen)
