restaurant_screen = '''import React, { useEffect, useState } from 'react';
import {
View,
Text,
StyleSheet,
Image,
ScrollView,
TouchableOpacity,
Dimensions,
Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { GlassCard } from '../../components/ui/GlassCard';
import { GradientButton } from '../../components/ui/GradientButton';
import api, { endpoints } from '../../constants/api';
import { useCartStore } from '../../store/cartStore';
import { showMessage } from 'react-native-flash-message';

const { width } = Dimensions.get('window');

const RestaurantScreen = () => {
const [restaurant, setRestaurant] = useState(null);
const [loading, setLoading] = useState(true);
const [selectedCategory, setSelectedCategory] = useState('All');
const navigation = useNavigation();
const route = useRoute();
const { id } = route.params as { id: string };
const { items, restaurant: cartRestaurant, addItem } = useCartStore();

useEffect(() => {
fetchRestaurant();
}, [id]);

const fetchRestaurant = async () => {
try {
setLoading(true);
const response = await api.get(endpoints.restaurants.detail(id));
setRestaurant(response.data.data);
} catch (error) {
showMessage({
message: 'Error',
description: 'Failed to load restaurant',
type: 'danger',
});
} finally {
setLoading(false);
}
};

const handleAddToCart = (item) => {
const restaurantInfo = {
id: restaurant._id,
name: restaurant.name,
deliveryFee: restaurant.deliveryFee,
minOrderAmount: restaurant.minOrderAmount,
};

addItem(  
  {  
    menuItemId: item._id,  
    name: item.name,  
    price: item.discountedPrice || item.price,  
    quantity: 1,  
    image: item.image,  
  },  
  restaurantInfo  
);  

showMessage({  
  message: 'Added to Cart',  
  description: `${item.name} added to your cart`,  
  type: 'success',  
  duration: 1500,  
});

};

const getCategories = () => {
if (!restaurant?.menuByCategory) return [];
return ['All', ...Object.keys(restaurant.menuByCategory)];
};

const getFilteredItems = () => {
if (!restaurant?.menuByCategory) return [];
if (selectedCategory === 'All') {
return Object.values(restaurant.menuByCategory).flat();
}
return restaurant.menuByCategory[selectedCategory] || [];
};

const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
const cartTotal = useCartStore.getState().subtotal();

if (loading || !restaurant) {
return (
<View style={[styles.container, styles.centered]}>
<Text style={styles.loadingText}>Loading...</Text>
</View>
);
}

return (
<View style={styles.container}>
{/* Header Image */}
<View style={styles.headerContainer}>
<Image
source={{ uri: restaurant.coverImage || restaurant.logo || 'https://via.placeholder.com/400' }}
style={styles.coverImage}
/>
<LinearGradient
colors={['transparent', colors.background]}
style={styles.gradientOverlay}
/>

{/* Back Button */}  
    <TouchableOpacity  
      style={styles.backButton}  
      onPress={() => navigation.goBack()}  
    >  
      <Icon name="arrow-back" size={24} color={colors.text} />  
    </TouchableOpacity>  

    {/* Restaurant Info Overlay */}  
    <View style={styles.restaurantOverlay}>  
      <Image  
        source={{ uri: restaurant.logo || 'https://via.placeholder.com/80' }}  
        style={styles.logo}  
      />  
      <View style={styles.restaurantInfo}>  
        <Text style={styles.restaurantName}>{restaurant.name}</Text>  
        <Text style={styles.restaurantCuisine}>  
          {restaurant.cuisine?.join(' • ')}  
        </Text>  
        <View style={styles.ratingRow}>  
          <View style={styles.ratingBadge}>  
            <Icon name="star" size={14} color={colors.accent} />  
            <Text style={styles.ratingText}>  
              {restaurant.rating?.average?.toFixed(1) || '4.5'}  
            </Text>  
          </View>  
          <Text style={styles.deliveryTime}>  
            {restaurant.deliveryTime?.min || 30}-{restaurant.deliveryTime?.max || 45} min  
          </Text>  
          <Text style={styles.deliveryFee}>  
            ₹{restaurant.deliveryFee || 0} delivery  
          </Text>  
        </View>  
      </View>  
    </View>  
  </View>  

  <ScrollView showsVerticalScrollIndicator={false}>  
    {/* Categories */}  
    <ScrollView  
      horizontal  
      showsHorizontalScrollIndicator={false}  
      contentContainerStyle={styles.categoriesContainer}  
    >  
      {getCategories().map((category) => (  
        <TouchableOpacity  
          key={category}  
          style={[  
            styles.categoryChip,  
            selectedCategory === category && styles.categoryChipActive,  
          ]}  
          onPress={() => setSelectedCategory(category)}  
        >  
          <Text  
            style={[  
              styles.categoryChipText,  
              selectedCategory === category && styles.categoryChipTextActive,  
            ]}  
          >  
            {category}  
          </Text>  
        </TouchableOpacity>  
      ))}  
    </ScrollView>  

    {/* Menu Items */}  
    <View style={styles.menuContainer}>  
      <Text style={styles.menuTitle}>Menu</Text>  
      {getFilteredItems().map((item) => (  
        <GlassCard key={item._id} style={styles.menuItem} intensity="low">  
          <View style={styles.menuItemContent}>  
            <View style={styles.menuItemInfo}>  
              <View style={styles.vegIndicator}>  
                <View  
                  style={[  
                    styles.vegDot,  
                    { backgroundColor: item.isVeg ? colors.success : colors.error },  
                  ]}  
                />  
              </View>  
              <Text style={styles.menuItemName}>{item.name}</Text>  
              <Text style={styles.menuItemDescription} numberOfLines={2}>  
                {item.description}  
              </Text>  
              <View style={styles.priceRow}>  
                <Text style={styles.menuItemPrice}>  
                  ₹{item.discountedPrice || item.price}  
                </Text>  
                {item.discountedPrice && (  
                  <Text style={styles.originalPrice}>₹{item.price}</Text>  
                )}  
              </View>  
            </View>  
              
            <View style={styles.menuItemImageContainer}>  
              <Image  
                source={{ uri: item.image || 'https://via.placeholder.com/100' }}  
                style={styles.menuItemImage}  
              />  
              <TouchableOpacity  
                style={styles.addButton}  
                onPress={() => handleAddToCart(item)}  
              >  
                <Text style={styles.addButtonText}>ADD</Text>  
              </TouchableOpacity>  
            </View>  
          </View>  
        </GlassCard>  
      ))}  
    </View>  
  </ScrollView>  

  {/* Cart Bar */}  
  {cartItemCount > 0 && (  
    <TouchableOpacity  
      style={styles.cartBar}  
      onPress={() => navigation.navigate('Cart' as never)}  
    >  
      <View style={styles.cartInfo}>  
        <Text style={styles.cartItemCount}>  
          {cartItemCount} item{cartItemCount > 1 ? 's' : ''}  
        </Text>  
        <Text style={styles.cartTotal}>₹{cartTotal.toFixed(0)}</Text>  
      </View>  
      <View style={styles.viewCartButton}>  
        <Text style={styles.viewCartText}>View Cart</Text>  
        <Icon name="arrow-forward" size={18} color={colors.text} />  
      </View>  
    </TouchableOpacity>  
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
headerContainer: {
height: 280,
position: 'relative',
},
coverImage: {
width: '100%',
height: '100%',
},
gradientOverlay: {
position: 'absolute',
bottom: 0,
left: 0,
right: 0,
height: 150,
},
backButton: {
position: 'absolute',
top: 60,
left: spacing.lg,
width: 40,
height: 40,
borderRadius: 20,
backgroundColor: 'rgba(0,0,0,0.5)',
justifyContent: 'center',
alignItems: 'center',
},
restaurantOverlay: {
position: 'absolute',
bottom: -30,
left: spacing.lg,
right: spacing.lg,
flexDirection: 'row',
alignItems: 'flex-end',
},
logo: {
width: 80,
height: 80,
borderRadius: borderRadius.lg,
borderWidth: 3,
borderColor: colors.background,
},
restaurantInfo: {
marginLeft: spacing.md,
flex: 1,
marginBottom: spacing.sm,
},
restaurantName: {
fontSize: 24,
fontWeight: 'bold',
color: colors.text,
},
restaurantCuisine: {
fontSize: 14,
color: colors.textSecondary,
marginTop: 2,
},
ratingRow: {
flexDirection: 'row',
alignItems: 'center',
marginTop: spacing.sm,
gap: spacing.md,
},
ratingBadge: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.accent + '30',
paddingHorizontal: 8,
paddingVertical: 4,
borderRadius: borderRadius.sm,
gap: 4,
},
ratingText: {
color: colors.accent,
fontWeight: 'bold',
fontSize: 14,
},
deliveryTime: {
color: colors.textSecondary,
fontSize: 14,
},
deliveryFee: {
color: colors.textSecondary,
fontSize: 14,
},
categoriesContainer: {
paddingHorizontal: spacing.lg,
paddingTop: 40,
paddingBottom: spacing.md,
gap: spacing.sm,
},
categoryChip: {
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
borderRadius: borderRadius.full,
backgroundColor: colors.surface,
marginRight: spacing.sm,
},
categoryChipActive: {
backgroundColor: colors.primary,
},
categoryChipText: {
color: colors.textSecondary,
fontWeight: '500',
},
categoryChipTextActive: {
color: colors.text,
},
menuContainer: {
padding: spacing.lg,
},
menuTitle: {
fontSize: 20,
fontWeight: 'bold',
color: colors.text,
marginBottom: spacing.md,
},
menuItem: {
marginBottom: spacing.md,
},
menuItemContent: {
flexDirection: 'row',
},
menuItemInfo: {
flex: 1,
paddingRight: spacing.md,
},
vegIndicator: {
width: 16,
height: 16,
borderWidth: 1,
borderColor: colors.textMuted,
justifyContent: 'center',
alignItems: 'center',
marginBottom: spacing.sm,
},
vegDot: {
width: 8,
height: 8,
borderRadius: 4,
},
menuItemName: {
fontSize: 16,
fontWeight: '600',
color: colors.text,
marginBottom: 4,
},
menuItemDescription: {
fontSize: 13,
color: colors.textSecondary,
marginBottom: spacing.sm,
},
priceRow: {
flexDirection: 'row',
alignItems: 'center',
gap: spacing.sm,
},
menuItemPrice: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
},
originalPrice: {
fontSize: 14,
color: colors.textMuted,
textDecorationLine: 'line-through',
},
menuItemImageContainer: {
width: 100,
alignItems: 'center',
},
menuItemImage: {
width: 100,
height: 100,
borderRadius: borderRadius.md,
},
addButton: {
position: 'absolute',
bottom: -10,
backgroundColor: colors.primary,
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
borderRadius: borderRadius.sm,
shadowColor: colors.primary,
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.4,
shadowRadius: 8,
elevation: 8,
},
addButtonText: {
color: colors.text,
fontWeight: 'bold',
fontSize: 14,
},
cartBar: {
position: 'absolute',
bottom: 0,
left: 0,
right: 0,
backgroundColor: colors.primary,
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal: spacing.lg,
paddingVertical: spacing.md,
paddingBottom: spacing.lg + 10,
},
cartInfo: {
flexDirection: 'row',
alignItems: 'center',
gap: spacing.md,
},
cartItemCount: {
color: colors.text,
fontSize: 14,
opacity: 0.9,
},
cartTotal: {
color: colors.text,
fontSize: 18,
fontWeight: 'bold',
},
viewCartButton: {
flexDirection: 'row',
alignItems: 'center',
gap: spacing.sm,
},
viewCartText: {
color: colors.text,
fontSize: 16,
fontWeight: 'bold',
},
});

export default RestaurantScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/restaurant/RestaurantScreen.tsx", "w") as f:
f.write(restaurant_screen)
