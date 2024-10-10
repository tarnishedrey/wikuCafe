import { View, Text, ScrollView } from "react-native";
import React from "react";
import CartComp from "../components/Cart/CartComp";
import { SafeAreaView } from "react-native-safe-area-context";

const Cart = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <CartComp />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;
