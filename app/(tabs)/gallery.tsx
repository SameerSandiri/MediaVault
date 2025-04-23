import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import { googleConfig, fetchGooglePhotos } from '../../utils/googlePhotos';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 10;
const ITEM_WIDTH = (width - (SPACING * (COLUMN_COUNT + 1))) / COLUMN_COUNT;

export default function GalleryScreen() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: googleConfig.clientId,
    scopes: googleConfig.scopes,
    redirectUri: googleConfig.redirectUri,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      loadGooglePhotos(access_token);
    }
  }, [response]);

  const loadGooglePhotos = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const items = await fetchGooglePhotos(accessToken);
      setPhotos(items);
    } catch (error) {
      console.error('Error loading photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleImageSelection = (id: string) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imageId => imageId !== id)
        : [...prev, id]
    );
  };

  const handleDownload = () => {
    if (selectedImages.length > 0) {
      router.push('/downloads');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => toggleImageSelection(item.id)}
    >
      <Image 
        source={{ uri: item.baseUrl || item.url }} 
        style={styles.image}
      />
      <View style={[
        styles.checkbox,
        selectedImages.includes(item.id) && styles.checkboxSelected
      ]}>
        {selectedImages.includes(item.id) && (
          <Ionicons name="checkmark" size={16} color="#FFFFFF" />
        )}
      </View>
    </TouchableOpacity>
  );

  if (photos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Connect to Google Photos</Text>
          <TouchableOpacity
            style={styles.connectButton}
            onPress={() => promptAsync()}
            disabled={!request}
          >
            <Ionicons name="logo-google" size={24} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Connect with Google Photos</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gallery</Text>
        {selectedImages.length > 0 && (
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={handleDownload}
          >
            <Ionicons name="download" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={photos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={COLUMN_COUNT}
        contentContainerStyle={styles.gridContainer}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(41, 121, 255, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2979FF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 20,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  downloadButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  },
  gridContainer: {
    padding: SPACING,
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    margin: SPACING / 2,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2979FF',
    borderColor: '#2979FF',
  },
});