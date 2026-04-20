search_screen = '''import React, { useState, useEffect } from 'react';
import {
View,
Text,
StyleSheet,
TextInput,
FlatList,
TouchableOpacity,
Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { colors, gradients, spacing, borderRadius } from '../../constants/colors';
import { GlassCard } from '../../components/ui/GlassCard';
import api, { endpoints } from '../../constants/api';
import { showMessage } from 'react-native-flash-message';

const recentSearches = ['Burger', 'Pizza', 'Biryani', 'Sushi', 'Dessert'];

const SearchScreen = () => {
const [query, setQuery] = useState('');
const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
const navigation = useNavigation();

useEffect(() => {
const delayDebounce = setTimeout(() => {
if (query.length > 2) {
searchRestaurants();
}
}, 500);

return () => clearTimeout(delayDebounce);

}, [query]);

const searchRestaurants = async () => {
try {
setLoading(true);
const response = await api.get(endpoints.restaurants.list, {
params: { search: query },
});
setResults(response.data.data);
} catch (error) {
console.error('Search Error:', error);
} finally {
setLoading(false);
}
};

const renderRestaurant = ({ item }) => (
<TouchableOpacity
style={styles.resultCard}
onPress={() => navigation.navigate('Restaurant', { id: item._id })}
>
<Image
source={{ uri: item.logo || 'https://via.placeholder.com/80' }}
style={styles.resultImage}
/>
<View style={styles.resultInfo}>
<Text style={styles.resultName}>{item.name}</Text>
<Text style={styles.resultCuisine}>{item.cuisine?.join(', ')}</Text>
<View style={styles.resultMeta}>
<Icon name="star" size={14} color={colors.accent} />
<Text style={styles.ratingText}>{item.rating?.average?.toFixed(1) || '4.5'}</Text>
<Text style={styles.dot}>•</Text>
<Text style={styles.deliveryTime}>{item.deliveryTime?.min || 30} min</Text>
</View>
</View>
</TouchableOpacity>
);

return (
<View style={styles.container}>
{/* Search Header */}
<View style={styles.header}>
<View style={styles.searchContainer}>
<Icon name="search-outline" size={20} color={colors.textMuted} />
<TextInput  
style={styles.searchInput}  
placeholder="Search restaurants, cuisines..."  
placeholderTextColor={colors.textMuted}  
value={query}  
onChangeText={setQuery}  
autoFocus  
/>
{query.length > 0 && (
<TouchableOpacity onPress={() => setQuery('')}>
<Icon name="close-circle" size={20} color={colors.textMuted} />
</TouchableOpacity>
)}
</View>
</View>

{query.length === 0 ? (  
    <View style={styles.recentContainer}>  
      <Text style={styles.sectionTitle}>Recent Searches</Text>  
      <View style={styles.recentList}>  
        {recentSearches.map((item, index) => (  
          <TouchableOpacity  
            key={index}  
            style={styles.recentChip}  
            onPress={() => setQuery(item)}  
          >  
            <Icon name="time-outline" size={16} color={colors.textSecondary} />  
            <Text style={styles.recentText}>{item}</Text>  
          </TouchableOpacity>  
        ))}  
      </View>  

      <Text style={styles.sectionTitle}>Popular Cuisines</Text>  
      <View style={styles.cuisineGrid}>  
        {['Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Continental'].map((cuisine) => (  
          <TouchableOpacity  
            key={cuisine}  
            style={styles.cuisineCard}  
            onPress={() => setQuery(cuisine)}  
          >  
            <Text style={styles.cuisineEmoji}>  
              {cuisine === 'Indian' ? '🍛' :   
               cuisine === 'Chinese' ? '🥡' :  
               cuisine === 'Italian' ? '🍝' :  
               cuisine === 'Mexican' ? '🌮' :  
               cuisine === 'Thai' ? '🍜' : '🥗'}  
            </Text>  
            <Text style={styles.cuisineName}>{cuisine}</Text>  
          </TouchableOpacity>  
        ))}  
      </View>  
    </View>  
  ) : (  
    <FlatList  
      data={results}  
      renderItem={renderRestaurant}  
      keyExtractor={(item) => item._id}  
      contentContainerStyle={styles.resultsList}  
      ListEmptyComponent={  
        <View style={styles.emptyContainer}>  
          <Icon name="search-outline" size={64} color={colors.textMuted} />  
          <Text style={styles.emptyText}>  
            {loading ? 'Searching...' : 'No results found'}  
          </Text>  
        </View>  
      }  
    />  
  )}  
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
searchContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.surface,
borderRadius: borderRadius.lg,
paddingHorizontal: spacing.md,
height: 50,
},
searchInput: {
flex: 1,
color: colors.text,
fontSize: 16,
marginLeft: spacing.sm,
},
recentContainer: {
padding: spacing.lg,
},
sectionTitle: {
fontSize: 18,
fontWeight: 'bold',
color: colors.text,
marginBottom: spacing.md,
marginTop: spacing.lg,
},
recentList: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: spacing.sm,
},
recentChip: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: colors.surface,
paddingHorizontal: spacing.md,
paddingVertical: spacing.sm,
borderRadius: borderRadius.full,
gap: spacing.sm,
},
recentText: {
color: colors.textSecondary,
fontSize: 14,
},
cuisineGrid: {
flexDirection: 'row',
flexWrap: 'wrap',
gap: spacing.md,
},
cuisineCard: {
width: '30%',
aspectRatio: 1,
backgroundColor: colors.surface,
borderRadius: borderRadius.lg,
justifyContent: 'center',
alignItems: 'center',
},
cuisineEmoji: {
fontSize: 32,
marginBottom: spacing.sm,
},
cuisineName: {
color: colors.text,
fontSize: 14,
fontWeight: '500',
},
resultsList: {
padding: spacing.lg,
},
resultCard: {
flexDirection: 'row',
backgroundColor: colors.surface,
borderRadius: borderRadius.lg,
padding: spacing.md,
marginBottom: spacing.md,
},
resultImage: {
width: 80,
height: 80,
borderRadius: borderRadius.md,
},
resultInfo: {
flex: 1,
marginLeft: spacing.md,
justifyContent: 'center',
},
resultName: {
fontSize: 16,
fontWeight: 'bold',
color: colors.text,
marginBottom: 4,
},
resultCuisine: {
fontSize: 13,
color: colors.textSecondary,
marginBottom: 4,
},
resultMeta: {
flexDirection: 'row',
alignItems: 'center',
gap: spacing.sm,
},
ratingText: {
color: colors.accent,
fontWeight: '600',
fontSize: 13,
},
dot: {
color: colors.textMuted,
},
deliveryTime: {
color: colors.textSecondary,
fontSize: 13,
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

export default SearchScreen;
'''

with open("/mnt/kimi/output/foodflow-ecosystem/customer-app/src/screens/main/SearchScreen.tsx", "w") as f:
f.write(search_screen)
