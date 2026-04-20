checkout_screen = '''import React, { useState } from 'react';
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import api, { endpoints } from '../../constants/api';
import { showMessage } from 'react-native-flash-message';

const paymentMethods = [
{ id: 'cod', name: 'Cash on Delivery', icon: 'cash-outline' },
{ id: 'upi', name: 'UPI Payment', icon: 'phone-portrait-outline' },
{ id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
];

const CheckoutScreen = () => {
const navigation = useNavigation();
const { user } = useAuthStore();
const { items, restaurant, total, clearCart, coupon } = useCartStore();
const [selectedPayment, setSelectedPayment] = useState('cod');
const [loading, setLoading] = useState(false);
const [selectedAddress, setSelectedAddress] = useState(
user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0]
);

const handlePlaceOrder = async () => {
if (!selectedAddress) {
showMessage({
message: 'No Address',
description: 'Please add a delivery address',
type: 'warning',
});
return;
}

try {  
  setLoading(true);  

  const orderData = {  
    restaurantId: restaurant.id,  
    items: items.map((item) => ({  
      menuItemId: item.menuItemId,  
      quantity: item.quantity,  
      variants: item.variants || [],  
      addons: item.addons || [],  
    })),  
    deliveryAddress: selectedAddress,  
    paymentMethod: selectedPayment,  
    couponCode: coupon?.code,  
  };  

  const response = await api.post(endpoints.orders.create, orderData);  

  if (response.data.success) {  
    clearCart();  
    showMessage({  
      message: 'Order Placed!',  
      description: 'Your order has been placed successfully',  
      type: 'success',  
    });  
    navigation.navigate('OrderTracking', {  
      orderId: response.data.data._id,  
    } as never);  
  }  
} catch (error: any) {  
  showMessage({  
    message: 'Error',  
    description: error.response?.data?.message || 'Failed to place order',  
    type: 'danger',  
  });  
} finally {  
  setLoading(false);  
}

};

return (
<View style={styles.container}>
{/* Header */}
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Icon name="arrow-back" size={24} color={colors.text} />
</TouchableOpacity>
<Text style={styles.headerTitle}>Checkout</Text>
<View style={{ width: 24 }} />
</View>

<ScrollView showsVerticalScrollIndicator={false}>  
    {/* Delivery Address */}  
    <View style={styles.section}>  
      <View style={styles.sectionHeader}>  
        <Text style={styles.sectionTitle}>Delivery Address</Text>  
        <TouchableOpacity>  
          <Text style={styles.changeText}>Change</Text>  
        </TouchableOpacity>  
      </View>  
        
      {selectedAddress ? (  
        <GlassCard style={styles.addressCard}>  
          <View style={styles.addressRow}>  
            <View style={styles.addressIcon}>  
              <Icon name="location" size={24} color={colors.primary} />  
            </View>  
            <View style={styles.addressInfo}>  
              <Text style={styles.addressLabel}>  
                {selectedAddress.label?.toUpperCase() || 'HOME'}  
              </Text>  
              <Text style={styles.addressText} numberOfLines={2}>  
                {selectedAddress.full}  
              </Text>  
            </View>  
          </View>  
        </GlassCard>  
      ) : (  
        <TouchableOpacity style={styles.addAddressButton}>  
          <Icon name="add-circle" size={24} color={colors.primary} />  
          <Text style={styles.addAddressText}>Add New Address</Text>  
        </TouchableOpacity>  
      )}  
    </View>  

    {/* Payment Method */}  
    <View style={styles.section}>  
      <Text style={styles.sectionTitle}>Payment Method</Text>  
        
      {paymentMethods.map((method) => (  
        <TouchableOpacity  
          key={method.id}  
          style={[  
            styles.paymentOption,  
            selectedPayment === method.id && styles.paymentOptionSelected,  
          ]}  
          onPress={() => setSelectedPayment(method.id)}  
        >  
          <View style={styles.paymentIcon}>  
            <Icon  
              name={method.icon}  
              size={24}  
              color={selectedPayment === method.id ? colors.primary : colors.text}  
            />  
          </View>  
          <Text  
            style={[  
              styles.paymentText,  
              selectedPayment === method.id && styles.paymentTextSelected,  
            ]}  
          >  
            {method.name}  
          </Text>  
          {selectedPayment === method.id && (  
            <Icon name="checkmark-circle" size={24} color={colors.primary} />  
          )}  
        </TouchableOpacity>  
      ))}  
    </View>  

    {/* Order Summary */}  
    <View style={styles.section}>  
      <Text style={styles.sectionTitle}>Order Summary</Text>  
      <GlassCard style={styles.summaryCard}>  
        <View style={styles.summaryRow}>  
          <Text style={styles.summaryLabel}>Items Total</Text>  
          <Text style={styles.summaryValue}>  
            ₹{useCartStore.getState().subtotal().toFixed(0)}  
          </Text>  
        </View>  
        <View style={styles.summaryRow}>  
          <Text style={styles.summaryLabel}>Delivery Fee</Text>  
          <Text style={styles.summaryValue}>₹{restaurant?.deliveryFee || 0}</Text>  
        </View>  
        {coupon?.discount > 0 && (  
          <View style={styles.summaryRow}>  
            <Text style={[styles.summaryLabel, styles.discountText]}>  
              Discount ({coupon.code})  
            </Text>  
            <Text style={[styles.summaryValue, styles.discountText]}>  
              -₹{coupon.discount}  
            </Text>  
          </View>  
        )}  
        <View style={styles.divider} />  
        <View style={styles.summaryRow}>  
          <Text style={styles.totalLabel}>Total Amount</Text>  
          <Text style={styles.totalValue}>₹{total().toFixed(0)}</Text>  
        </View>  
      </GlassCard>  
    </View>  

    {/* Spacing */}  
    <View style={{ height: 100 }} />  
  </ScrollView>  

  {/* Place Order Button */}  
  <View style={styles.footer}>  
    <View style={styles.footerInfo}>  
      <Text style={styles.footerTotal}>₹{total().toFixed(0)}</Text>  
      <Text style={styles.footerLabel}>TOTAL</Text>  
    </View>  
    <GradientButton  
      title="Place Order"  
      onPress={handlePlaceOrder}  
      loading={loading}  
      style={styles.placeOrderButton}  
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
section: {
paddingHorizontal: spacing.lg,
marginBottom: spacing.lg,
},
sectionHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: spacing.md,
},
sectionTitle: {
fontSize: 18,
fontWeight: 'bold',
color: colors.text,
marginBottom: spacing.md,
},
changeText: {
color: colors.primary,
fontSize: 14,
fontWeight: '600',
},
addressCard: {
padding: spacing.md,
},
addressRow: {
flexDirection: 'row',
alignItems: 'center',
},
addressIcon: {
width: 48,
height: 48,
borderRadius: 24,
backgroundColor: colors.primary + '20',
justifyContent: 'center',
alignItems: 'center',
marginRight: spacing.md,
},
addressInfo: {
flex: 1,
},
addressLabel: {
fontSize: 12,
color: colors.primary,
fontWeight: 'bold',
marginBottom: 4,
},
addressText: {
fontSize: 14,
color: colors.text,
lineHeight: 20,
},
addAddressButton: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
padding: spacing.lg,
borderWidth: 2,
borderColor: colors.surfaceLight,
borderRadius: borderRadius.lg,
borderStyle: 'dashed',
},
addAddressText: {
color: colors.primary,
fontSize: 16,
fontWeight: '600',
marginLeft: spacing.sm,
},
paymentOption: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.surface,
padding: spacing.md,
borderRadius: borderRadius.lg,
marginBottom: spacing.sm,
borderWidth: 2,
borderColor: 'transparent',
},
paymentOptionSelected: {
borderColor: colors.primary,
backgroundColor: colors.primary + '10',
},
paymentIcon: {
width: 48,
height: 48,
borderRadius: 24,
backgroundColor: colors.backgroundLight,
justifyContent: 'center',
alignItems: 'center',
marginRight: spacing.md,
},
paymentText: {
flex: 1,
fontSize: 16,
color: colors.text,
fontWeight: '500',
},
paymentTextSelected: {
color: colors.primary,
fontWeight: 'bold',
},
summaryCard: {
padding: spacing.md,
},
summaryRow: {
flexDirection: 'row',
justifyContent: 'space-between',
marginBottom: spacing.sm,
},
summaryLabel: {
fontSize: 14,
color: colors.textSecondary,
},
summaryValue: {
fontSize: 14,
color: colors.text,
fontWeight: '500',
},
discountText: {
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
fontSize: 20,
fontWeight: 'bold',
color: colors.primary,
},
footer: {
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
footerInfo: {
flex: 1,
justifyContent: 'center',
},
footerTotal: {
fontSize: 20,
fontWeight: 'bold',
color: colors.text,
},
footerLabel: {
fontSize: 12,
color: colors.textSecondary,
},
placeOrderButton: {
flex: 2,
},
});

export default CheckoutScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/orders/CheckoutScreen.tsx", "w") as f:
f.write(checkout_screen)
