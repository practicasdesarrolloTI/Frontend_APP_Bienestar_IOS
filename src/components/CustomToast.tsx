import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { CheckCircle, AlertTriangle, Info } from "lucide-react-native";
import Toast from 'react-native-toast-message';
import Colors from '../themes/colors';

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning';
  text1: string;
  text2?: string;
}

const iconMap = {
  success: <CheckCircle color="#00B094" size={28} />,
  error: <AlertTriangle color="#FF5F3F" size={28} />,
  info: <Info color="#80006A" size={28} />,
  warning: <AlertTriangle color="#FFF280" size={28} />,
};

const bgColorMap = {
  success: Colors.secondary,
  error: Colors.error,
  info: Colors.primary,
  warning: Colors.softOrange,
};

const textColorMap = {
  success: '#FFFFFF',
  error: '#FFFFFF',
  info: '#FFFFFF',
  warning: '#000000',
};

const CustomToast = ({ type, text1, text2}: ToastProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { backgroundColor: bgColorMap[type], opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={StyleSheet.absoluteFill}>
      </View>

      {/* <View style={styles.icon}>{iconMap[type]}</View> */}
      <View style={styles.textWrapper}>
        <Text style={[styles.title, { color: textColorMap[type] }]}>{text1}</Text>
        {text2 && <Text style={[styles.message, { color: textColorMap[type] }]}>{text2}</Text>}
        <TouchableOpacity
          activeOpacity={0.7}
                    // onPress={() => Toast.hide()}
        >
          {/* <Text style={[styles.button, { color: textColorMap[type] }]}>Entendido</Text> */}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 50,
    borderRadius: 20,
    marginTop: 55,
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 4,
  },
  icon: {
    marginRight: 12,
    zIndex: 2,
  },
  textWrapper: {
    flex: 1,
    zIndex: 2,
  },
  title: {
    fontFamily: 'DM-Sans',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    fontFamily: 'DM-Sans',
    fontSize: 16,
    marginTop: 4,
  },
  button: {
    marginTop: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  bgIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    opacity: 0.1,
    zIndex: 0,
    transform: [{ rotate: '20deg' }],
  },
});

export default CustomToast;