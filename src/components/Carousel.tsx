import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import colors from "../themes/colors";

const { width } = Dimensions.get("window");

const images = [
  require("../../assets/imagen_1_banner.png"),
  require("../../assets/imagen_2_banner.png"),
  require("../../assets/imagen_3_banner.png"),
];

const DOT_SIZE = 8;

const ImageCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <Carousel
        width={width * 0.85}
        height={180}
        data={images}
        autoPlay
        loop
        scrollAnimationDuration={4000}
        onSnapToItem={(index) => setActiveIndex(index)}
        style={{ borderRadius: 8 }}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={item} style={styles.image} resizeMode="cover" />
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {images.map((_, index) => (
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
    marginTop: 20,
  },
  imageWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 1, // Espaciado entre imágenes
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
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

export default ImageCarousel;
