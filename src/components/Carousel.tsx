import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  Platform,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Carousel from "react-native-reanimated-carousel";
import colors from "../themes/colors";
import { fetchBanners } from "../services/bannerService";
import SkeletonLoading from "./SkeletonLoading";

function clamp(min: number, v: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

const ImageUrlCarousel: React.FC = () => {
  const [banners, setBanners] = useState<
    { id: string; title: string; imageUrl: string }[]
  >([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Responsive dimensions
  const { width, height } = useWindowDimensions();
  const isTablet =
    Platform.OS === "ios" ? (Platform as any).isPad === true : width >= 950;
  const PADDING_H = isTablet
    ? Math.round(width * 0.08)
    : Math.round(width * 0.04);
  const SLIDE_WIDTH = clamp(
    isTablet ? 420 : 260, // mínimo razonable
    Math.min(width - PADDING_H * 1.5, isTablet ? 800 : width * 0.85), // preferido
    isTablet ? 820 : 380 // máximo
  );
  const SLIDE_HEIGHT = Math.round(SLIDE_WIDTH * RATIO);
  const DOT_SIZE = isTablet ? moderateScale(10) : moderateScale(8);
  const DOT_SPACING = isTablet ? moderateScale(8) : moderateScale(6);

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
      <View style={[styles.container, { paddingHorizontal: PADDING_H }]}>
        <SkeletonLoading
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT + moderateScale(8),
            borderRadius: moderateScale(15),
            marginBottom: verticalScale(10),
          }}
          borderRadius={moderateScale(15)}
        />
      </View>
    );
  }

  if (banners.length === 0) {
    return (
      <View style={[styles.container, { paddingHorizontal: PADDING_H }]}>
        <SkeletonLoading
          style={{
            width: SLIDE_WIDTH,
            height: SLIDE_HEIGHT + moderateScale(8),
            marginBottom: verticalScale(10),
          }}
          borderRadius={moderateScale(15)}
        />
      </View>
    );
  }

  if (banners.length === 1) {
    return (
      <View style={[styles.container, { paddingHorizontal: PADDING_H }]}>
        <View style={styles.slide}>
          <Image
            source={{ uri: banners[0].imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        {/* Pagination Dots */}
        <View style={[styles.pagination, { marginTop: verticalScale(8) }]}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  width: DOT_SIZE,
                  height: DOT_SIZE,
                  borderRadius: DOT_SIZE / 2,
                  marginHorizontal: DOT_SPACING / 2,
                },
                activeIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingHorizontal: PADDING_H }]}>
      <Carousel
        width={SLIDE_WIDTH}
        height={SLIDE_HEIGHT}
        data={banners}
        autoPlay
        loop
        scrollAnimationDuration={4000}
        onSnapToItem={(index) => setActiveIndex(index)}
        style={{ borderRadius: moderateScale(15) }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.slide,
              {
                width: SLIDE_WIDTH,
                height: SLIDE_HEIGHT,
                borderRadius: moderateScale(15),
              },
            ]}
          >
            <Image
              source={{ uri: item.imageUrl }}
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
            style={[
              styles.dot,
              {
                width: DOT_SIZE,
                height: DOT_SIZE,
                borderRadius: DOT_SIZE / 2,
                marginHorizontal: DOT_SPACING / 2,
              },
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const RATIO = 138 / 356;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  slide: {
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
    marginVertical: verticalScale(8),
  },
  dot: {
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: colors.lightGray,
  },
});

export default ImageUrlCarousel;
