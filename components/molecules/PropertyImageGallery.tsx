import React from 'react';
import { View, FlatList, Image, Pressable, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface PropertyImageGalleryProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  flatListRef: React.RefObject<FlatList<any> | null>;
}

export default function PropertyImageGallery({
  images,
  currentIndex,
  onIndexChange,
  flatListRef
}: PropertyImageGalleryProps) {
  return (
    <View className="relative">
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          onIndexChange(index);
        }}
        renderItem={({ item: imageUrl }) => (
          <Image
            source={{ uri: imageUrl }}
            style={{ width: screenWidth, height: 320 }}
            resizeMode="cover"
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      {/* Image Indicators */}
      {images.length > 1 && (
        <View 
          className="absolute bottom-4 left-1/2 flex-row gap-2" 
          style={{ transform: [{ translateX: -((images.length * 12) / 2) }] }}
        >
          {images.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => {
                onIndexChange(index);
                flatListRef.current?.scrollToIndex({ 
                  index, 
                  animated: true 
                });
              }}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}