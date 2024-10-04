import React from "react";
import { Slot } from "expo-router";
import { CartProvider } from "@/src/contexts/CartContext"; // Ensure correct path to CartContext
import { SafeAreaView, StatusBar } from "react-native";

const Layout = () => {
  return (
    <CartProvider>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Add a StatusBar for better UX */}
        <StatusBar barStyle="dark-content" />
        {/* Slot is where other components will be injected by the router */}
        <Slot />
      </SafeAreaView>
    </CartProvider>
  );
};

export default Layout;
