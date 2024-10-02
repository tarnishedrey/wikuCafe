import {
  View,
  Text,
  SafeAreaView,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CartComp from "@/src/components/Cart/CartComp";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../components/Header/Header";

const Cart = () => {
  const router = useRouter();
  const localParams = useLocalSearchParams<{
    menus: string;
    itemPrices: string;
    total: string;
  }>();
  useEffect(() => {
    if (!localParams.menus || !localParams.itemPrices || !localParams.total) {
      console.warn("Ada yang ilang kocak");
    }
  }, [localParams]);

  const [menus] = useState(localParams.menus.split(", "));
  const [prices] = useState(
    localParams.itemPrices.split(", ").map((price) => Number(price))
  );
  const [total] = useState(Number(localParams.total));

  return (
    <ScrollView>
      <Header />

      <CartComp itemPrices={prices} menus={menus} total={total} />
    </ScrollView>
  );
};

export default Cart;
