import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../components/Menu/Menu";
import Greet from "../components/Welcome/Greet";
import { CartProvider } from "../contexts/CartContext";
import Cart from "./Cart";

const index = () => {
  return (
    <CartProvider>
      <View style={{ flex: 1 }}>
        <Greet />
        <Menu />
      </View>
    </CartProvider>
  );
};

export default index;
