import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Carousel from "react-native-reanimated-carousel";
import colors from "../themes/colors";
import { fetchBanners } from "../services/bannerService";
import SkeletonLoading from "./SkeletonLoading";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_WIDTH = SCREEN_WIDTH * 0.84;
const SLIDE_HEIGHT = verticalScale(115);
const DOT_SIZE = moderateScale(8);
const DOT_SPACING = moderateScale(6);

const ImageUrlCarousel: React.FC = () => {
  const [banners, setBanners] = useState<
    { id: string; title: string; imageUrl: string }[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const data = await fetchBanners();
        setBanners(data);
      } catch (err) {
        console.error("Error cargando banners", err);
      } finally {
        setLoading(false);
      }
    };
    loadBanners();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <SkeletonLoading
          style={{ width: "85%", height: 168, marginBottom: 10 }}
          borderRadius={8}
        />
      </View>
    );
  }

  if (banners.length === 0) {
    return (
      <View style={styles.container}>
        <SkeletonLoading
          style={{ width: scale(85), height: 168, marginBottom: 10 }}
          borderRadius={8}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        width={SLIDE_WIDTH}
        height= {SLIDE_HEIGHT}
        data={banners}
        autoPlay
        loop
        scrollAnimationDuration={4000}
        onSnapToItem={(index) => setActiveIndex(index)}
        style={{ borderRadius: moderateScale(15) }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{
                uri: item.imageUrl,
              }}
              style={styles.image}
              resizeMode="cover"
            />
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
    paddingVertical: verticalScale(12),
  },
  slide: {
    width: SLIDE_WIDTH,
    height: SLIDE_HEIGHT,
    borderRadius: moderateScale(15),
    overflow: "hidden",
    marginHorizontal: scale(2),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(8),
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#ccc",
    marginHorizontal: DOT_SPACING / 2,
  },
  activeDot: {
    backgroundColor: colors.lightGray,
  },
});

export default ImageUrlCarousel;