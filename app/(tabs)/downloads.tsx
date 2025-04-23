import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function DownloadsScreen() {
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isComplete) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Simulate download completion after 3 seconds
      const timer = setTimeout(() => {
        setIsComplete(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isComplete]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
          </View>
          <Text style={styles.congratsTitle}>Congratulations!</Text>
          <Text style={styles.congratsSubtitle}>
            Your file has been successfully downloaded
          </Text>
          <View style={styles.gradientBorder}>
            <Text style={styles.fileName}>media_vault.zip</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
        <Text style={styles.title}>Downloading...</Text>
        <Text style={styles.subtitle}>
          Downloading the selected photos into a .zip file...
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#2979FF',
    borderTopColor: 'transparent',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#B0B0B0',
    textAlign: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  congratsTitle: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#4CAF50',
    marginBottom: 12,
    textAlign: 'center',
  },
  congratsSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    color: '#FFFFFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  gradientBorder: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#2979FF',
    shadowColor: '#2979FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fileName: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#2979FF',
  },
});