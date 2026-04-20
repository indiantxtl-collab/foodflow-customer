order_tracking_screen = '''import React, { useEffect, useState, useRef } from 'react';
import {
View,
Text,
StyleSheet,
ScrollView,
TouchableOpacity,
Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import io from 'socket.io-client';

import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import api, { endpoints } from '../../constants/api';
import { showMessage } from 'react-native-flash-message';

const { width } = Dimensions.get('window');

const orderStatuses = [
{ key: 'pending', label: 'Order Placed', icon: 'receipt-outline' },
{ key: 'confirmed', label: 'Confirmed', icon: 'checkmark-circle-outline' },
{ key: 'preparing', label: 'Preparing', icon: 'restaurant-outline' },
{ key: 'ready', label: 'Ready', icon: 'fast-food-outline' },
{ key: 'out_for_delivery', label: 'On the Way', icon: 'bicycle-outline' },
{ key: 'delivered', label: 'Delivered', icon: 'home-outline' },
];

const OrderTrackingScreen = () => {
const navigation = useNavigation();
const route = useRoute();
const { orderId } = route.params as { orderId: string };
const [order, setOrder] = useState(null);
const [loading, setLoading] = useState(true);
const [deliveryLocation, setDeliveryLocation] = useState(null);
const socketRef = useRef(null);

useEffect(() => {
fetchOrder();
connectSocket();

return () => {  
  if (socketRef.current) {  
    socketRef.current.disconnect();  
  }  
};

}, [orderId]);

const connectSocket = () => {
const socket = io('https://your-api-url.com'); // Replace with your server URL
socketRef.current = socket;

socket.emit('join_user', order?.user?._id);  

socket.on('order_update', (updatedOrder) => {  
  if (updatedOrder._id === orderId) {  
    setOrder(updatedOrder);  
  }  
});  

socket.on('delivery_location_update', (data) => {  
  if (data.orderId === orderId) {  
    setDeliveryLocation(data.location);  
  }  
});

};

const fetchOrder = async () => {
try {
const response = await api.get(endpoints.orders.detail(orderId));
setOrder(response.data.data);
} catch (error) {
showMessage({
message: 'Error',
description: 'Failed to load order',
type: 'danger',
});
} finally {
setLoading(false);
}
};

const getStatusIndex = (status) => {
return orderStatuses.findIndex((s) => s.key === status);
};

const currentStatusIndex = getStatusIndex(order?.status);

if (loading || !order) {
return (
<View style={[styles.container, styles.centered]}>
<Text style={styles.loadingText}>Loading...</Text>
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
<Text style={styles.headerTitle}>Track Order</Text>
<View style={{ width: 24 }} />
</View>

<ScrollView showsVerticalScrollIndicator={false}>  
    {/* Order ID */}  
    <View style={styles.orderIdContainer}>  
      <Text style={styles.orderIdLabel}>Order ID</Text>  
      <Text style={styles.orderId}>{order.orderId}</Text>  
    </View>  

    {/* Map */}  
    {order.status === 'out_for_delivery' && (  
      <View style={styles.mapContainer}>  
        <MapView  
          style={styles.map}  
          initialRegion={{  
            latitude: order.deliveryAddress?.coordinates?.[1] || 28.6139,  
            longitude: order.deliveryAddress?.coordinates?.[0] || 77.2090,  
            latitudeDelta: 0.0922,  
            longitudeDelta: 0.0421,  
          }}  
        >  
          {/* Restaurant Marker */}  
          <Marker  
            coordinate={{  
              latitude: order.restaurant?.location?.coordinates?.[1] || 28.6139,  
              longitude: order.restaurant?.location?.coordinates?.[0] || 77.2090,  
            }}  
            title={order.restaurant?.name}  
          >  
            <View style={styles.markerContainer}>  
              <Icon name="restaurant" size={20} color={colors.primary} />  
            </View>  
          </Marker>  

          {/* Delivery Location */}  
          {deliveryLocation && (  
            <Marker  
              coordinate={{  
                latitude: deliveryLocation.lat,  
                longitude: deliveryLocation.lng,  
              }}  
            >  
              <View style={[styles.markerContainer, styles.deliveryMarker]}>  
                <Icon name="bicycle" size={20} color={colors.text} />  
              </View>  
            </Marker>  
          )}  

          {/* Destination */}  
          <Marker  
            coordinate={{  
              latitude: order.deliveryAddress?.coordinates?.[1] || 28.6139,  
              longitude: order.deliveryAddress?.coordinates?.[0] || 77.2090,  
            }}  
            title="Delivery Location"  
          >  
            <View style={[styles.markerContainer, styles.destinationMarker]}>  
              <Icon name="home" size={20} color={colors.text} />  
            </View>  
          </Marker>  
        </MapView>  
      </View>  
    )}  

    {/* Status Timeline */}  
    <View style={styles.timelineContainer}>  
      <Text style={styles.timelineTitle}>Order Status</Text>  
        
      {orderStatuses.map((status, index) => {  
        const isCompleted = index <= currentStatusIndex;  
        const isCurrent = index === currentStatusIndex;  

        return (  
          <View key={status.key} style={styles.timelineItem}>  
            <View style={styles.timelineLeft}>  
              <View  
                style={[  
                  styles.timelineIcon,  
                  isCompleted && styles.timelineIconCompleted,  
                  isCurrent && styles.timelineIconCurrent,  
                ]}  
              >  
                <Icon  
                  name={status.icon}  
                  size={20}  
                  color={isCompleted ? colors.text : colors.textMuted}  
                />  
              </View>  
              {index < orderStatuses.length - 1 && (  
                <View  
                  style={[  
                    styles.timelineLine,  
                    index < currentStatusIndex && styles.timelineLineCompleted,  
                  ]}  
                />  
              )}  
            </View>  
            <View style={styles.timelineContent}>  
              <Text  
                style={[  
                  styles.timelineLabel,  
                  isCompleted && styles.timelineLabelCompleted,  
                  isCurrent && styles.timelineLabelCurrent,  
                ]}  
              >  
                {status.label}  
              </Text>  
              {isCurrent && order.status === 'out_for_delivery' && (  
                <Text style={styles.timelineSubtext}>  
                  Your delivery partner is on the way  
                </Text>  
              )}  
            </View>  
          </View>  
        );  
      })}  
    </View>  

    {/* Delivery Partner Info */}  
    {order.deliveryAgent && (  
      <GlassCard style={styles.deliveryAgentCard}>  
        <Text style={styles.deliveryAgentTitle}>Delivery Partner</Text>  
        <View style={styles.deliveryAgentInfo}>  
          <View style={styles.deliveryAgentAvatar}>  
            <Icon name="person" size={32} color={colors.text} />  
          </View>  
          <View style={styles.deliveryAgentDetails}>  
            <Text style={styles.deliveryAgentName}>{order.deliveryAgent.name}</Text>  
            <Text style={styles.deliveryAgentPhone}>  
              {order.deliveryAgent.phone}  
            </Text>  
          </View>  
          <TouchableOpacity style={styles.callButton}>  
            <Icon name="call" size={24} color={colors.success} />  
          </TouchableOpacity>  
        </View>  
      </GlassCard>  
    )}  

    {/* Order Details */}  
    <GlassCard style={styles.orderDetailsCard}>  
      <Text style={styles.orderDetailsTitle}>Order Details</Text>  
      {order.items.map((item, index) => (  
        <View key={index} style={styles.orderItem}>  
          <Text style={styles.orderItemName}>  
            {item.quantity}× {item.name}  
          </Text>  
          <Text style={styles.orderItemPrice}>  
            ₹{(item.price * item.quantity).toFixed(0)}  
          </Text>  
        </View>  
      ))}  
      <View style={styles.divider} />  
      <View style={styles.orderTotal}>  
        <Text style={styles.orderTotalLabel}>Total</Text>  
        <Text style={styles.orderTotalValue}>  
          ₹{order.pricing?.total?.toFixed(0)}  
        </Text>  
      </View>  
    </GlassCard>  

    {/* Spacing */}  
    <View style={{ height: 100 }} />  
  </ScrollView>  

  {/* Bottom Actions */}  
  {order.status === 'delivered' && !order.rating && (  
    <View style={styles.footer}>  
      <GradientButton  
        title="Rate Order"  
        onPress={() => navigation.navigate('RateOrder', { orderId })}  
        style={styles.rateButton}  
      />  
    </View>  
  )}  
</View>

);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
},
centered: {
justifyContent: 'center',
alignItems: 'center',
},
loadingText: {
color: colors.text,
fontSize: 18,
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
orderIdContainer: {
paddingHorizontal: spacing.lg,
marginBottom: spacing.md,
},
orderIdLabel: {
fontSize: 12,
color: colors.textSecondary,
marginBottom: 4,
},
orderId: {
fontSize: 18,
fontWeight: 'bold',
color: colors.primary,
},
mapContainer: {
height: 250,
marginHorizontal: spacing.lg,
borderRadius: borderRadius.lg,
overflow: 'hidden',
marginBottom: spacing.lg,
},
map: {
flex: 1,
},
markerContainer: {
width: 40,
height: 40,
borderRadius: 20,
backgroundColor: colors.surface,
justifyContent: 'center',
alignItems: 'center',
borderWidth: 2,
borderColor: colors.primary,
},
deliveryMarker: {
backgroundColor: colors.primary,
borderColor: colors.text,
},
destinationMarker: {
backgroundColor: colors.success,
borderColor: colors.text,
},
timelineContainer: {
paddingHorizontal: spacing.lg,
marginBottom: spacing.lg,
},
timelineTitle: {
fontSize: 18,
fontWeight: 'bold',
color: colors.text,
marginBottom: spacing.md,
},
timelineItem: {
flexDirection: 'row',
},
timelineLeft: {
alignItems: 'center',
width: 50,
},
timelineIcon: {
width: 40,
height: 40,
borderRadius: 20,
backgroundColor: colors.surface,
justifyContent: 'center',
alignItems: 'center',
zIndex: 1,
},
timelineIconCompleted: {
backgroundColor: colors.success,
},
timelineIconCurrent: {
backgroundColor: colors.primary,
},
timelineLine: {
width: 2,
flex: 1,
backgroundColor: colors.surfaceLight,
marginVertical: 4,
},
timelineLineCompleted: {
backgroundColor: colors.success,
},
timelineContent: {
flex: 1,
paddingLeft: spacing.md,
paddingBottom: spacing.lg,
},
timelineLabel: {
fontSize: 16,
color: colors.textSecondary,
fontWeight: '500',
},
timelineLabelCompleted: {
color: colors.text,
},
timelineLabelCurrent: {
color: colors.primary,
fontWeight: 'bold',
},
timelineSubtext: {
fontSize: 13,
color: colors.textSecondary,
marginTop: 4,
},
deliveryAgentCard: {
marginHorizontal: spacing.lg,
marginBottom: spacing.lg,
},
deliveryAgentTitle: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
marginBottom: spacing.md,
},
deliveryAgentInfo: {
flexDirection: 'row',
alignItems: 'center',
},
deliveryAgentAvatar: {
width: 50,
height: 50,
borderRadius: 25,
backgroundColor: colors.surfaceLight,
justifyContent: 'center',
alignItems: 'center',
},
deliveryAgentDetails: {
flex: 1,
marginLeft: spacing.md,
},
deliveryAgentName: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
},
deliveryAgentPhone: {
fontSize: 14,
color: colors.textSecondary,
marginTop: 2,
},
callButton: {
width: 48,
height: 48,
borderRadius: 24,
backgroundColor: colors.success + '20',
justifyContent: 'center',
alignItems: 'center',
},
orderDetailsCard: {
marginHorizontal: spacing.lg,
marginBottom: spacing.lg,
},
orderDetailsTitle: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
marginBottom: spacing.md,
},
orderItem: {
flexDirection: 'row',
justifyContent: 'space-between',
marginBottom: spacing.sm,
},
orderItemName: {
fontSize: 14,
color: colors.text,
flex: 1,
},
orderItemPrice: {
fontSize: 14,
color: colors.textSecondary,
fontWeight: '500',
},
divider: {
height: 1,
backgroundColor: colors.surfaceLight,
marginVertical: spacing.md,
},
orderTotal: {
flexDirection: 'row',
justifyContent: 'space-between',
},
orderTotalLabel: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
},
orderTotalValue: {
fontSize: 18,
fontWeight: 'bold',
color: colors.primary,
},
footer: {
position: 'absolute',
bottom: 0,
left: 0,
right: 0,
padding: spacing.lg,
paddingBottom: spacing.lg + 20,
backgroundColor: colors.backgroundLight,
borderTopWidth: 1,
borderTopColor: colors.surfaceLight,
},
rateButton: {
width: '100%',
},
});

export default OrderTrackingScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/orders/OrderTrackingScreen.tsx", "w") as f:
f.write(order_tracking_screen)
