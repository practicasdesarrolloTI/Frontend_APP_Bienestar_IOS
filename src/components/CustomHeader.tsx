import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Image,
  Platform,
  useWindowDimensions
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import colors from "../themes/colors";
import { fonts } from "../themes/fonts";

type HeaderProps = {
  title?: string;
  showBack?: boolean;
  color?: string;
  backgroundColor?: string;
  transparent?: boolean;
  showProfileIcon?: boolean;
  onLogout: () => void;
  goBackTo?: keyof RootStackParamList;
};

type RootStackParamList = {
  Informacion: undefined;
  Home: undefined;
  Landing: undefined;
};

const CustomHeader: React.FC<HeaderProps> = ({
  title = "",
  color,
  showBack = true,
  backgroundColor,
  transparent = false,
  showProfileIcon = false,
  onLogout,
  goBackTo,
}) => {
  const { width,height } = useWindowDimensions();
  const HH = Math.round(Math.max(53, Math.min(110, height * 0.08)));

  const isTablet = Platform.OS === "ios" ? (Platform as any).isPad === true : width >= 768;
  const PROFILE_SIZE = isTablet ? 70 : 46;               
  const ICON_SIZE = Math.round(PROFILE_SIZE * 0.55);     
  const MENU_WIDTH = Math.min(isTablet ? 260 : 180, Math.max(170, width * (isTablet ? 0.3 : 0.5)));
  const MENU_TOP = PROFILE_SIZE + 8; 

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View
      style={[
        styles.header,
        transparent
          ? styles.transparent
          : { backgroundColor: backgroundColor || colors.primary },
        { height: HH}
      ]}
    >
      {/*Botón para atrás */}
      {showBack && (
        <TouchableOpacity
          style={[styles.backButton, { width: PROFILE_SIZE, height: PROFILE_SIZE }]}
          onPress={() => {
            if (goBackTo) {
              // navigation.navigate(goBackTo);
              navigation.reset({
                index: 1,
                routes: [{ name: goBackTo }],
              });
            } else {
              navigation.goBack();
            }
          }}
        >
          <Image
            source={require("../../assets/icons/atras.png")}
            style={[styles.icon , { width: ICON_SIZE, height: ICON_SIZE }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}

      {/* Título del header */}
     <View style={styles.titleContainer}>
        {!!title && (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.headerTitle, transparent && { color: color || colors.preto }]}
          >
            {title}
          </Text>
        )}
      </View>

      {/* Icono de persona con menú */}
      {showProfileIcon && (
        <View style={{ position: "relative" }}>
          <TouchableOpacity
            style={[styles.profileIcon ,{ width: PROFILE_SIZE, height: PROFILE_SIZE }]}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Image
              source={require("../../assets/icons/perfil.png")}
              style={{ width: ICON_SIZE, height: ICON_SIZE }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {menuVisible && (
            <View style={[styles.inlineMenu, { width: MENU_WIDTH, top: MENU_TOP }]}>
              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  navigation.navigate("Informacion");
                }}
              >
                <Text style={styles.menuItem}>Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setMenuVisible(false);
                  onLogout();
                }}
              >
                <Text style={styles.menuItem}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: scale(22),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  transparent: {
    backgroundColor: "transparent" as ViewStyle["backgroundColor"],
  },
  backButton: {
    width: scale(35),
    height: scale(35),
    borderRadius: scale(20),
    backgroundColor: "#FEFEFE",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: verticalScale(3),
    elevation: 5,
  },
  profileWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  profileIcon: {    
    borderRadius: scale(50),
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: verticalScale(3),
    elevation: 5,
  },
  icon: {
    width: scale(24),
    height: scale(24),
  },
  titleContainer: {
    justifyContent: "flex-start",
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    padding: verticalScale(4),
    paddingLeft: scale(15),
    height: '100%'
  },
  headerTitle: {
    alignContent: "center",
    justifyContent: "flex-start",
    fontSize: moderateScale(20),
    fontFamily: fonts.title,
  },
  inlineMenu: {
    position: "absolute",
    top: verticalScale(40),
    right: 0,
    width: scale(125),
    backgroundColor: colors.white,
    borderRadius: scale(8),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(15),
    shadowColor: colors.preto,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: verticalScale(3),
    elevation: 5,
    zIndex: 999,
  },
  menuItem: {
    paddingVertical: verticalScale(6),
    fontSize: moderateScale(14),
    fontFamily: fonts.subtitle,
    color: colors.preto,
  },
});

export default CustomHeader;
