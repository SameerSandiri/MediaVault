import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { googleConfig } from '../utils/googlePhotos';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  useSharedValue,
  withDelay,
  withSpring,
  withSequence,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 30;
const ORBS_COUNT = 4;

const Particle = ({ delay, type }: { delay: number; type: 'small' | 'medium' | 'large' }) => {
  const sizes = {
    small: { width: 2, height: 2 },
    medium: { width: 4, height: 4 },
    large: { width: 6, height: 6 },
  };

  const translateY = useSharedValue(height);
  const translateX = useSharedValue(Math.random() * width);
  const scale = useSharedValue(0.3 + Math.random() * 0.7);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0.1 + Math.random() * 0.4);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-100, {
          duration: 12000 + Math.random() * 8000,
        }),
        -1,
        false
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(translateX.value + 100, {
            duration: 4000,
          }),
          withTiming(translateX.value - 100, {
            duration: 4000,
          })
        ),
        -1,
        true
      )
    );

    rotate.value = withRepeat(
      withTiming(360, {
        duration: 8000,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.particle, 
        sizes[type],
        animatedStyle,
      ]} 
    />
  );
};

const FloatingOrb = ({ delay, index }: { delay: number; index: number }) => {
  const translateY = useSharedValue(Math.random() * height);
  const translateX = useSharedValue(Math.random() * width);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(translateY.value + 50, {
            duration: 4000,
          }),
          withTiming(translateY.value - 50, {
            duration: 4000,
          })
        ),
        -1,
        true
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(translateX.value + 50, {
            duration: 6000,
          }),
          withTiming(translateX.value - 50, {
            duration: 6000,
          })
        ),
        -1,
        true
      )
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, {
          duration: 2000,
        }),
        withTiming(1, {
          duration: 2000,
        })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.orb, animatedStyle]}>
      <LinearGradient
        colors={index % 2 === 0 ? ['#2979FF', '#00C6FF'] : ['#7C4DFF', '#2979FF']}
        style={styles.orbGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

// Add more visual elements for an extraordinary background
const ShootingStar = ({ delay }: { delay: number }) => {
  const startX = useSharedValue(-50);
  const startY = useSharedValue(Math.random() * height * 0.7);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);

  useEffect(() => {
    const animate = () => {
      startX.value = -50;
      startY.value = Math.random() * height * 0.7;
      opacity.value = 0;
      scale.value = 0.3;

      startX.value = withDelay(
        delay,
        withTiming(width + 100, { duration: 1500 })
      );
      
      startY.value = withDelay(
        delay,
        withTiming(startY.value + 100, { duration: 1500 })
      );
      
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(0.8, { duration: 200 }),
          withTiming(0.8, { duration: 1000 }),
          withTiming(0, { duration: 300 })
        )
      );
      
      scale.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0.5, { duration: 1300 })
        )
      );

      // Repeat the animation after a random delay
      setTimeout(animate, 3000 + Math.random() * 7000);
    };

    animate();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: startX.value },
      { translateY: startY.value },
      { scale: scale.value },
      { rotate: '20deg' }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.shootingStar, animatedStyle]}>
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.shootingStarGradient}
      />
    </Animated.View>
  );
};

// Pulsating background effect
const PulsatingBackground = () => {
  const opacity = useSharedValue(0.1);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.2, { duration: 3000 }),
        withTiming(0.1, { duration: 3000 })
      ),
      -1,
      true
    );

    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 4000 }),
        withTiming(1, { duration: 4000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <LinearGradient
        colors={['#000428', '#004e92']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleConfig.clientId,
    scopes: googleConfig.scopes,
    redirectUri: googleConfig.redirectUri,
  });

  const titleScale = useSharedValue(0.9);

  useEffect(() => {
    titleScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(0.95, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Base gradient */}
      <LinearGradient
        colors={['#000000', '#1A237E']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Pulsating background */}
      <PulsatingBackground />

      {/* Animated Background */}
      <View style={styles.particleContainer}>
        {/* Shooting stars */}
        {Array.from({ length: 3 }).map((_, index) => (
          <ShootingStar key={`star-${index}`} delay={index * 2000} />
        ))}
        
        {/* Floating orbs */}
        {Array.from({ length: ORBS_COUNT }).map((_, index) => (
          <FloatingOrb key={`orb-${index}`} delay={index * 500} index={index} />
        ))}
        
        {/* Particles */}
        {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
          <Particle 
            key={`particle-${index}`} 
            delay={index * 200} 
            type={index % 3 === 0 ? 'large' : index % 2 === 0 ? 'medium' : 'small'}
          />
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.Text style={[styles.title, titleStyle]}>MediaVault</Animated.Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F5F5F5']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.googleButtonContent}>
                <View style={styles.googleIconContainer}>
                  <Ionicons name="logo-google" size={20} color="#000000" />
                </View>
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleSkip}
          >
            <LinearGradient
              colors={['#2979FF', '#1565C0']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#2979FF',
    borderRadius: 50,
    shadowColor: '#2979FF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  orb: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  orbGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.15,
  },
  shootingStar: {
    position: 'absolute',
    width: 100,
    height: 3,
    borderRadius: 1,
  },
  shootingStarGradient: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    fontFamily: Platform.select({ web: 'Inter', default: 'Inter_700Bold' }),
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: Platform.select({ web: 240, default: 200 }),
    textShadowColor: 'rgba(41, 121, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 280,
    gap: 16,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    overflow: 'hidden',
  },
  googleButton: {
    width: '100%',
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  googleIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 14,
    fontFamily: Platform.select({ web: 'Inter', default: 'Inter_600SemiBold' }),
    color: '#000000',
  },
  nextButton: {
    width: '100%',
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#2979FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 14,
    fontFamily: Platform.select({ web: 'Inter', default: 'Inter_600SemiBold' }),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 44,
  },
});