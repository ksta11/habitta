import React, { useState } from 'react';
import { View, ScrollView, Image, Text, Dimensions } from 'react-native';

interface ImageCarouselProps {
  images: string[];
  height?: number;
}

export default function ImageCarousel({ images, height = 256 }: ImageCarouselProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleScroll = (event: any) => {
    const screenWidth = Dimensions.get('window').width;
    const imageIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentImageIndex(imageIndex);
  };

  if (!images || images.length === 0) {
    return (
      <View 
        className="bg-gray-200 justify-center items-center"
        style={{ height }}
      >
        <Text className="text-gray-500">Sin imágenes</Text>
      </View>
    );
  }

  return (
    <View style={{ height }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={handleScroll}
      >
        {images.map((imageUrl, index) => (
          <Image
            key={`image-${index}`}
            source={{ uri: imageUrl }}
            className="w-screen"
            style={{ height }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
      
      {/* Indicator - only show if more than 1 image */}
      {images.length > 1 && (
        <View className="absolute bottom-4 right-4 bg-black/50 rounded-full px-3 py-1">
          <Text className="text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </Text>
        </View>
      )}
    </View>
  );
}