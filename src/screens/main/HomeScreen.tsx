home_screen = '''import React, { useEffect, useState, useCallback } from 'react';
import {
View,
Text,
StyleSheet,
FlatList,
Image,
TouchableOpacity,
RefreshControl,
ScrollView,
Dimensions,
TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
useSharedValue,
useAnimatedStyle,
withSpring,
interpolate,
Extrapolate,
} from 'react-native-reanimated';

import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { GlassCard } from '../../components/ui/GlassCard';
import { useAuthStore } from '../../store/authStore';
import api, { endpoints } from '../../constants/api';
import { showMessage } from 'react-native-flash-message';

const { width } = Dimensions.get('window');

const categories = [
{ id: '1', name: 'All', icon: '🍽️' },
{ id: '2', name: 'Burger', icon: '🍔' },
{ id: '3', name: 'Pizza', icon: '🍕' },
{ id: '4', name: 'Sushi', icon: '🍣' },
{ id: '5', name: 'Indian', icon: '🍛' },
{ id: '6', name: 'Dessert', icon: '🍰' },
{ id: '7', name: 'Drinks', icon: '🥤' },
];

const HomeScreen = () => {
const [restaurants, setRestaurants] = useState([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [selectedCategory, setSelectedCategory] = useState('All');
const [searchQuery, setSearchQuery] = useState('');
const navigation = useNavigation();
const { user } = useAuthStore();

useEffect(() => {
fetchRestaurants();
}, [selectedCategory]);

const fetchRestaurants = async () => {
try {
setLoading(true);
const params = {};
if (selectedCategory !== 'All') {
params.cuisine = selectedCategory;
}
if (searchQuery) {
params.search = searchQuery;
}

const response = await api.get(endpoints.restaurants.list, { params });  
  setRestaurants(response.data.data);  
} catch (error) {  
  console.error('Fetch Restaurants Error:', error);  
  showMessage({  
    message: 'Error',  
    description: 'Failed to load restaurants',  
    type: 'danger',  
  });  
} finally {  
  setLoading(false);  
  setRefreshing(false);  
}

};

const onRefresh = useCallback(() => {
setRefreshing(true);
fetchRestaurants();
}, []);

const renderCategory = ({ item }) => (
<TouchableOpacity
style={[
styles.categoryItem,
selectedCategory === item.name && styles.categoryItemActive,
]}
onPress={() => setSelectedCategory(item.name)}
>
<Text style={styles.categoryIcon}>{item.icon}</Text>
<Text
style={[
styles.categoryName,
selectedCategory === item.name && styles.categoryNameActive,
]}
>
{item.name}
</Text>
</TouchableOpacity>
);

const renderRestaurant = ({ item, index }) => {
const scale = useSharedValue(1);

const animatedStyle = useAnimatedStyle(() => ({  
  transform: [{ scale: scale.value }],  
}));  

return (  
  <Animated.View style={[styles.restaurantCardContainer, animatedStyle]}>  
    <TouchableOpacity  
      style={styles.restaurantCard}  
      onPress={() => navigation.navigate('Restaurant', { id: item._id })}  
      onPressIn={() => {  
        scale.value = withSpring(0.95, { damping: 15 });  
      }}  
      onPressOut={() => {  
        scale.value = withSpring(1, { damping: 15 });  
      }}  
      activeOpacity={0.9}  
    >  
      <Image  
        source={{ uri: item.coverImage || item.logo || 'https://via.placeholder.com/300' }}  
        style={styles.restaurantImage}  
      />  
      <LinearGradient  
        colors={['transparent', 'rgba(0,0,0,0.8)']}  
        style={styles.imageOverlay}  
      >  
        <View style={styles.restaurantInfo}>  
          <Text style={styles.restaurantName} numberOfLines={1}>  
            {item.name}  
          </Text>  
          <View style={styles.restaurantMeta}>  
            <View style={styles.ratingBadge}>  
              <Icon name="star" size={12} color={colors.accent} />  
              <Text style={styles.ratingText}>  
                {item.rating?.average?.toFixed(1) || '4.5'}  
              </Text>  
            </View>  
            <Text style={styles.deliveryTime}>  
              {item.deliveryTime?.min || 30}-{item.deliveryTime?.max || 45} min  
            </Text>  
          </View>  
          <View style={styles.cuisineContainer}>  
            {item.cuisine?.slice(0, 3).map((c, i) => (  
              <View key={i} style={styles.cuisineTag}>  
                <Text style={styles.cuisineText}>{c}</Text>  
              </View>  
            ))}  
          </View>  
        </View>  
      </LinearGradient>  
        
      {/* Status Badge */}  
      <View style={[styles.statusBadge, !item.isOpen && styles.statusBadgeClosed]}>  
        <View style={[styles.statusDot, !item.isOpen && styles.statusDotClosed]} />  
        <Text style={styles.statusText}>  
          {item.isOpen ? 'Open' : 'Closed'}  
        </Text>  
      </View>  
    </TouchableOpacity>  
  </Animated.View>  
);

};

return (
<View style={styles.container}>
{/* Header */}
<LinearGradient colors={gradients.dark} style={styles.header}>
<View style={styles.headerContent}>
<View>
<Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Foodie'} 👋</Text>
<Text style={styles.location}>
<Icon name="location-outline" size={14} color={colors.primary} />
{' '}Deliver to Current Location
</Text>
</View>
<TouchableOpacity style={styles.profileButton}>
<Image
source={{ uri: user?.avatar || 'https://via.placeholder.com/40' }}
style={styles.profileImage}
/>
</TouchableOpacity>
</View>

{/* Search Bar */}  
    <View style={styles.searchContainer}>  
      <Icon name="search-outline" size={20} color={colors.textMuted} />  
      <TextInput  
        style={styles.searchInput}  
        placeholder="Search restaurants, cuisines..."  
        placeholderTextColor={colors.textMuted}  
        value={searchQuery}  
        onChangeText={setSearchQuery}  
        onSubmitEditing={fetchRestaurants}  
      />  
      <TouchableOpacity style={styles.filterButton}>  
        <Icon name="options-outline" size={20} color={colors.text} />  
      </TouchableOpacity>  
    </View>  
  </LinearGradient>  

  <ScrollView  
    showsVerticalScrollIndicator={false}  
    refreshControl={  
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />  
    }  
  >  
    {/* Categories */}  
    <FlatList  
      data={categories}  
      renderItem={renderCategory}  
      keyExtractor={(item) => item.id}  
      horizontal  
      showsHorizontalScrollIndicator={false}  
      contentContainerStyle={styles.categoriesContainer}  
    />  

    {/* Featured Section */}  
    <View style={styles.sectionHeader}>  
      <Text style={styles.sectionTitle}>Featured Restaurants</Text>  
      <TouchableOpacity>  
        <Text style={styles.seeAll}>See All</Text>  
      </TouchableOpacity>  
    </View>  

    {/* Restaurants Grid */}  
    <FlatList  
      data={restaurants}  
      renderItem={renderRestaurant}  
      keyExtractor={(item) => item._id}  
      numColumns={2}  
      contentContainerStyle={styles.restaurantsContainer}  
      scrollEnabled={false}  
      ListEmptyComponent={  
        <View style={styles.emptyContainer}>  
          <Icon name="restaurant-outline" size={64} color={colors.textMuted} />  
          <Text style={styles.emptyText}>No restaurants found</Text>  
        </View>  
      }  
    />  
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
paddingTop: 60,
paddingHorizontal: spacing.lg,
paddingBottom: spacing.lg,
},
headerContent: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: spacing.lg,
},
greeting: {
fontSize: 24,
fontWeight: 'bold',
color: colors.text,
marginBottom: 4,
},
location: {
fontSize: 14,
color: colors.textSecondary,
},
profileButton: {
width: 44,
height: 44,
borderRadius: 22,
overflow: 'hidden',
borderWidth: 2,
borderColor: colors.primary,
},
profileImage: {
width: '100%',
height: '100%',
},
searchContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.surface,
borderRadius: borderRadius.lg,
paddingHorizontal: spacing.md,
height: 50,
borderWidth: 1,
borderColor: colors.surfaceLight,
},
searchInput: {
flex: 1,
color: colors.text,
fontSize: 16,
marginLeft: spacing.sm,
},
filterButton: {
padding: spacing.sm,
},
categoriesContainer: {
paddingHorizontal: spacing.lg,
paddingVertical: spacing.md,
},
categoryItem: {
alignItems: 'center',
marginRight: spacing.md,
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
borderRadius: borderRadius.lg,
backgroundColor: colors.surface,
minWidth: 70,
},
categoryItemActive: {
backgroundColor: colors.primary,
},
categoryIcon: {
fontSize: 24,
marginBottom: 4,
},
categoryName: {
fontSize: 12,
color: colors.textSecondary,
fontWeight: '500',
},
categoryNameActive: {
color: colors.text,
},
sectionHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal: spacing.lg,
marginTop: spacing.md,
marginBottom: spacing.md,
},
sectionTitle: {
fontSize: 20,
fontWeight: 'bold',
color: colors.text,
},
seeAll: {
fontSize: 14,
color: colors.primary,
fontWeight: '600',
},
restaurantsContainer: {
paddingHorizontal: spacing.lg,
paddingBottom: spacing.xxl,
},
restaurantCardContainer: {
flex: 1,
margin: spacing.sm,
},
restaurantCard: {
borderRadius: borderRadius.lg,
overflow: 'hidden',
backgroundColor: colors.surface,
height: 200,
},
restaurantImage: {
width: '100%',
height: '100%',
},
imageOverlay: {
position: 'absolute',
bottom: 0,
left: 0,
right: 0,
padding: spacing.md,
height: '60%',
justifyContent: 'flex-end',
},
restaurantInfo: {
gap: 4,
},
restaurantName: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
},
restaurantMeta: {
flexDirection: 'row',
alignItems: 'center',
gap: spacing.sm,
},
ratingBadge: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.accent + '30',
paddingHorizontal: 6,
paddingVertical: 2,
borderRadius: 4,
gap: 2,
},
ratingText: {
fontSize: 12,
color: colors.accent,
fontWeight: '600',
},
deliveryTime: {
fontSize: 12,
color: colors.textSecondary,
},
cuisineContainer: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: 4,
marginTop: 4,
},
cuisineTag: {
backgroundColor: 'rgba(255,255,255,0.2)',
paddingHorizontal: 6,
paddingVertical: 2,
borderRadius: 4,
},
cuisineText: {
fontSize: 10,
color: colors.text,
},
statusBadge: {
position: 'absolute',
top: spacing.md,
right: spacing.md,
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.success + '90',
paddingHorizontal: 8,
paddingVertical: 4,
borderRadius: borderRadius.sm,
gap: 4,
},
statusBadgeClosed: {
backgroundColor: colors.error + '90',
},
statusDot: {
width: 6,
height: 6,
borderRadius: 3,
backgroundColor: colors.success,
},
statusDotClosed: {
backgroundColor: colors.error,
},
statusText: {
fontSize: 10,
color: colors.text,
fontWeight: '600',
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

export default HomeScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/main/HomeScreen.tsx", "w") as f:
f.write(home_screen)
