import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  useSharedValue,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

const SUGGESTIONS = [
  'Beautiful Sunsets',
  'Text Photos',
  'Photos of September 2022',
  'Nature Landscapes',
  'Family Photos',
  'Vacation Memories',
];

const AUTO_SUGGESTIONS = [
  'Search your photos by location',
  'Find all images with people',
  'Retrieve media from last month',
  'Show my favorite images',
  'Find videos with music',
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [nextSuggestionIndex, setNextSuggestionIndex] = useState(1);
  const router = useRouter();

  const currentOpacity = useSharedValue(1);
  const currentTranslateY = useSharedValue(0);
  const nextOpacity = useSharedValue(0);
  const nextTranslateY = useSharedValue(20);
  const backButtonScale = useSharedValue(1);
  const backButtonOpacity = useSharedValue(1);

  const updateSuggestionIndex = useCallback(() => {
    setCurrentSuggestionIndex(nextSuggestionIndex);
    setNextSuggestionIndex((nextSuggestionIndex + 1) % AUTO_SUGGESTIONS.length);
  }, [nextSuggestionIndex]);

  const animateSuggestions = useCallback(() => {
    if (isTyping) return;

    // Animate current suggestion out
    currentOpacity.value = withSequence(
      withTiming(0, { duration: 500 }),
      withDelay(500, withTiming(1, { duration: 0 }))
    );
    currentTranslateY.value = withSequence(
      withTiming(-20, { duration: 500 }),
      withDelay(500, withTiming(0, { duration: 0 }))
    );

    // Animate next suggestion in
    nextOpacity.value = withSequence(
      withTiming(1, { duration: 500 }),
      withDelay(500, withTiming(0, { duration: 0 }))
    );
    nextTranslateY.value = withSequence(
      withTiming(0, { duration: 500 }),
      withDelay(500, withTiming(20, { duration: 0 }))
    );

    // Update indices after animation
    setTimeout(() => {
      runOnJS(updateSuggestionIndex)();
    }, 500);
  }, [isTyping, updateSuggestionIndex]);

  useEffect(() => {
    const interval = setInterval(animateSuggestions, 3000);
    return () => clearInterval(interval);
  }, [animateSuggestions]);

  const currentSuggestionStyle = useAnimatedStyle(() => ({
    opacity: currentOpacity.value,
    transform: [{ translateY: currentTranslateY.value }],
  }));

  const nextSuggestionStyle = useAnimatedStyle(() => ({
    opacity: nextOpacity.value,
    transform: [{ translateY: nextTranslateY.value }],
  }));

  const backButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: backButtonScale.value }],
    opacity: backButtonOpacity.value,
  }));

  const handleTextChange = (text: string) => {
    setSearchQuery(text);
    setIsTyping(true);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setIsTyping(true);
    Keyboard.dismiss();
  };

  const handleInputFocus = () => {
    setIsTyping(true);
  };

  const handleInputBlur = () => {
    if (searchQuery === '') {
      setIsTyping(false);
    }
  };

  const handleBackPress = () => {
    // Animate the back button
    backButtonScale.value = withSpring(0.9, { damping: 15 });
    
    // Navigate immediately to the landing page
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonTop}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <Animated.View style={[styles.backButtonInner, backButtonStyle]}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </Animated.View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>AI Search</Text>
            <Text style={styles.subtitle}>Find your media using natural language</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleTextChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={isTyping ? 'Search your media...' : ''}
              placeholderTextColor="#757575"
            />
            {!isTyping && (
              <View style={styles.suggestionsOverlay}>
                <Animated.Text style={[styles.suggestionText, currentSuggestionStyle]}>
                  "{AUTO_SUGGESTIONS[currentSuggestionIndex]}"
                </Animated.Text>
                <Animated.Text style={[styles.suggestionText, nextSuggestionStyle, styles.absoluteText]}>
                  "{AUTO_SUGGESTIONS[nextSuggestionIndex]}"
                </Animated.Text>
              </View>
            )}
          </View>
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery('');
                setIsTyping(false);
              }} 
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#757575" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.suggestionsTitle}>Popular Searches</Text>
        <ScrollView style={styles.suggestionsContainer} contentContainerStyle={styles.scrollContent}>
          <View style={styles.suggestionsGrid}>
            {SUGGESTIONS.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.suggestionButton,
                  { backgroundColor: index % 2 === 0 ? '#2979FF' : '#1E1E1E' }
                ]}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Text style={[
                  styles.suggestionButtonText,
                  { color: index % 2 === 0 ? '#FFFFFF' : '#B0B0B0' }
                ]}>
                  {suggestion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Animated.View style={[styles.backButton, backButtonStyle]}>
            <Text style={styles.arrowSymbol}>←</Text>
          </Animated.View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  backButtonTop: {
    marginRight: 16,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2979FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2979FF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(41, 121, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#B0B0B0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    margin: 20,
    borderRadius: 15,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2979FF',
    shadowColor: '#2979FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    height: 24,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  suggestionsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  suggestionText: {
    color: '#757575',
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  absoluteText: {
    position: 'absolute',
  },
  clearButton: {
    padding: 4,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginLeft: 20,
    marginBottom: 12,
  },
  suggestionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  suggestionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2979FF',
  },
  suggestionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    zIndex: 999,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2979FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2979FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  arrowSymbol: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
});