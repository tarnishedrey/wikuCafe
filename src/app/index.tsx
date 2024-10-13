import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../components/Menu/Menu";
import Greet from "../components/Welcome/Greet";

const index = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Greet />
      <Menu />
    </SafeAreaView>
  );
};

export default index;
