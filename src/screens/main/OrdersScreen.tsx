orders_screen = '''import React, { useEffect, useState, useCallback } from 'react';
import {
View,
Text,
StyleSheet,
FlatList,
TouchableOpacity,
RefreshControl,
Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { GlassCard } from '../../components/ui/GlassCard';
import api, { endpoints } from '../../constants/api';

const orderStatuses = {
pending: { label: 'Pending', color: colors.warning, icon: 'time-outline' },
confirmed: { label: 'Confirmed', color: colors.info, icon: 'checkmark-circle-outline' },
preparing: { label: 'Preparing', color: colors.primary, icon: 'restaurant-outline' },
ready: { label: 'Ready', color: colors.success, icon: 'fast-food-outline' },
out_for_delivery: { label: 'On the Way', color: colors.secondary, icon: 'bicycle-outline' },
delivered: { label: 'Delivered', color: colors.success, icon: 'checkmark-done-outline' },
cancelled: { label: 'Cancelled', color: colors.error, icon: 'close-circle-outline' },
};

const OrdersScreen = () => {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(false);
const [activeTab, setActiveTab] = useState('active');
const navigation = useNavigation();

useFocusEffect(
useCallback(() => {
fetchOrders();
}, [activeTab])
);

const fetchOrders = async () => {
try {
setLoading(true);
const status = activeTab === 'active'
? 'pending,confirmed,preparing,ready,out_for_delivery'
: 'delivered,cancelled';

const response = await api.get(endpoints.orders.list, {  
    params: { status },  
  });  
  setOrders(response.data.data);  
} catch (error) {  
  console.error('Fetch Orders Error:', error);  
} finally {  
  setLoading(false);  
}

};

const renderOrder = ({ item }) => {
const status = orderStatuses[item.status] || orderStatuses.pending;

return (  
  <TouchableOpacity  
    onPress={() => navigation.navigate('OrderTracking', { orderId: item._id })}  
  >  
    <GlassCard style={styles.orderCard}>  
      <View style={styles.orderHeader}>  
        <View style={styles.restaurantInfo}>  
          <Image  
            source={{ uri: item.restaurant?.logo || 'https://via.placeholder.com/40' }}  
            style={styles.restaurantLogo}  
          />  
          <View>  
            <Text style={styles.restaurantName} numberOfLines={1}>  
              {item.restaurant?.name}  
            </Text>  
            <Text style={styles.orderDate}>  
              {new Date(item.createdAt).toLocaleDateString()}  
            </Text>  
          </View>  
        </View>  
        <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>  
          <Icon name={status.icon} size={14} color={status.color} />  
          <Text style={[styles.statusText, { color: status.color }]}>  
            {status.label}  
          </Text>  
        </View>  
      </View>  

      <View style={styles.itemsContainer}>  
        {item.items.slice(0, 2).map((orderItem, index) => (  
          <Text key={index} style={styles.itemText}>  
            {orderItem.quantity}× {orderItem.name}  
          </Text>  
        ))}  
        {item.items.length > 2 && (  
          <Text style={styles.moreItems}>  
            +{item.items.length - 2} more items  
          </Text>  
        )}  
      </View>  

      <View style={styles.orderFooter}>  
        <Text style={styles.totalLabel}>Total</Text>  
        <Text style={styles.totalAmount}>₹{item.pricing?.total?.toFixed(0)}</Text>  
      </View>  

      {['delivered', 'cancelled'].includes(item.status) && (  
        <TouchableOpacity style={styles.reorderButton}>  
          <Text style={styles.reorderText}>Reorder</Text>  
        </TouchableOpacity>  
      )}  
    </GlassCard>  
  </TouchableOpacity>  
);

};

return (
<View style={styles.container}>
{/* Header */}
<View style={styles.header}>
<Text style={styles.headerTitle}>My Orders</Text>
</View>

{/* Tabs */}  
  <View style={styles.tabContainer}>  
    <TouchableOpacity  
      style={[styles.tab, activeTab === 'active' && styles.tabActive]}  
      onPress={() => setActiveTab('active')}  
    >  
      <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>  
        Active  
      </Text>  
    </TouchableOpacity>  
    <TouchableOpacity  
      style={[styles.tab, activeTab === 'past' && styles.tabActive]}  
      onPress={() => setActiveTab('past')}  
    >  
      <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>  
        Past Orders  
      </Text>  
    </TouchableOpacity>  
  </View>  

  {/* Orders List */}  
  <FlatList  
    data={orders}  
    renderItem={renderOrder}  
    keyExtractor={(item) => item._id}  
    contentContainerStyle={styles.ordersList}  
    refreshControl={  
      <RefreshControl refreshing={loading} onRefresh={fetchOrders} tintColor={colors.primary} />  
    }  
    ListEmptyComponent={  
      <View style={styles.emptyContainer}>  
        <Icon name="receipt-outline" size={64} color={colors.textMuted} />  
        <Text style={styles.emptyText}>  
          No {activeTab === 'active' ? 'active' : 'past'} orders  
        </Text>  
      </View>  
    }  
  />  
</View>

);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
},
header: {
paddingTop: 60,
paddingHorizontal: spacing.lg,
paddingBottom: spacing.md,
},
headerTitle: {
fontSize: 28,
fontWeight: 'bold',
color: colors.text,
},
tabContainer: {
flexDirection: 'row',
paddingHorizontal: spacing.lg,
marginBottom: spacing.md,
},
tab: {
flex: 1,
paddingVertical: spacing.md,
alignItems: 'center',
borderBottomWidth: 2,
borderBottomColor: colors.surfaceLight,
},
tabActive: {
borderBottomColor: colors.primary,
},
tabText: {
fontSize: 16,
color: colors.textSecondary,
fontWeight: '500',
},
tabTextActive: {
color: colors.primary,
fontWeight: 'bold',
},
ordersList: {
padding: spacing.lg,
},
orderCard: {
marginBottom: spacing.md,
},
orderHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'flex-start',
marginBottom: spacing.md,
},
restaurantInfo: {
flexDirection: 'row',
alignItems: 'center',
flex: 1,
},
restaurantLogo: {
width: 40,
height: 40,
borderRadius: 20,
marginRight: spacing.md,
},
restaurantName: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
maxWidth: 150,
},
orderDate: {
fontSize: 12,
color: colors.textSecondary,
marginTop: 2,
},
statusBadge: {
flexDirection: 'row',
alignItems: 'center',
paddingHorizontal: 8,
paddingVertical: 4,
borderRadius: borderRadius.sm,
gap: 4,
},
statusText: {
fontSize: 12,
fontWeight: '600',
},
itemsContainer: {
marginBottom: spacing.md,
},
itemText: {
fontSize: 14,
color: colors.textSecondary,
marginBottom: 2,
},
moreItems: {
fontSize: 12,
color: colors.textMuted,
marginTop: 4,
},
orderFooter: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingTop: spacing.md,
borderTopWidth: 1,
borderTopColor: colors.surfaceLight,
},
totalLabel: {
fontSize: 14,
color: colors.textSecondary,
},
totalAmount: {
fontSize: 18,
fontWeight: 'bold',
color: colors.text,
},
reorderButton: {
marginTop: spacing.md,
backgroundColor: colors.primary,
paddingVertical: spacing.sm,
borderRadius: borderRadius.md,
alignItems: 'center',
},
reorderText: {
color: colors.text,
fontWeight: 'bold',
fontSize: 14,
},
emptyContainer: {
alignItems: 'center',
justifyContent: 'center',
paddingVertical: spacing.xxl,
},
emptyText: {
color: colors.textMuted,
marginTop: spacing.md,
fontSize: 16,
},
});

export default OrdersScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/main/OrdersScreen.tsx", "w") as f:
f.write(orders_screen)
