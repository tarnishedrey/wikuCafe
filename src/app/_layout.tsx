import React from "react";
import { Slot } from "expo-router";

import { SafeAreaView, StatusBar } from "react-native";

const Layout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Slot />
    </SafeAreaView>
  );
};

export default Layout;
