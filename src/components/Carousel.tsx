import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import colors from "../themes/colors";
import { fetchBanners } from "../services/bannerService";

const { width } = Dimensions.get("window");

const DOT_SIZE = 8;

const ImageUrlCarousel: React.FC = () => {
  const [banners, setBanners] = useState<{ id: string; title: string; imageUrl: string }[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const loadBanners = async () => {
      const data = await fetchBanners();
      console.log("Banners fetched:", data[0].imageUrl);
      setBanners(data);
    };
    loadBanners();
  }, []);

  if (banners.length === 0) return null;

  return (
    <View style={styles.container}>
      <Carousel
        width={width * 0.85}
        height={160}
        data={banners}
        autoPlay
        loop
        scrollAnimationDuration={4000}
        onSnapToItem={(index) => setActiveIndex(index)}
        style={{ borderRadius: 8 }}
        renderItem={({ item }) => (
          <View style={styles.imageUrlWrapper}>
            <Image source={{
              uri: item.imageUrl
            }} style={styles.imageUrl} resizeMode="cover" />
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, activeIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 10,
  },
  imageUrlWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  imageUrl: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: colors.lightGray, // color activo
  },
});

export default ImageUrlCarousel;
