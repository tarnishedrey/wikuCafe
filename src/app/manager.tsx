import { View, Text } from "react-native";
import React from "react";
import MaShowOrd from "../components/ManagerShowOrd/MaShowOrd";
import { SafeAreaView } from "react-native-safe-area-context";
import Greet from "../components/Welcome/Greet";

const manager = () => {
  return (
    <View>
      <Greet />
      <MaShowOrd />
    </View>
  );
};

export default manager;
