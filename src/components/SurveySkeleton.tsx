import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

const SurveySkeleton: React.FC = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={styles.card}>
      <View style={styles.shimmerWrapper}>
        <Animated.View
          style={[
            styles.shimmer,
            {
              transform: [{ translateX }],
            },
          ]}
        />
      </View>

      <View style={styles.skeletonTextBig} />
      <View style={styles.skeletonTextSmall} />
      <View style={styles.skeletonButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#eee",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    overflow: "hidden",
  },
  shimmerWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e0e0e0",
    overflow: "hidden",
  },
  shimmer: {
    width: "50%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    opacity: 0.4,
  },
  skeletonTextBig: {
    height: 20,
    width: "60%",
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonTextSmall: {
    height: 14,
    width: "90%",
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginBottom: 20,
  },
  skeletonButton: {
    height: 30,
    width: 100,
    backgroundColor: "#ccc",
    borderRadius: 20,
  },
});

export default SurveySkeleton;