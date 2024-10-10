import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../components/Menu/Menu";
import Greet from "../components/Welcome/Greet";

import Cart from "./Cart";

const index = () => {
  return (
    <View style={{ flex: 1 }}>
      <Greet />
      <Menu />
    </View>
  );
};

export default index;
