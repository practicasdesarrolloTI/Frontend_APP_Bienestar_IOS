import React, { useState } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

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
        height={200}
        data={images}
        autoPlay
        loop
        scrollAnimationDuration={1000}
        onSnapToItem={index => setActiveIndex(index)}
        style={{ borderRadius: 16 }}
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
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
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
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 2, // Espaciado entre imágenes
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
    backgroundColor: "#8B008B", // color activo
  },
});

export default ImageCarousel;