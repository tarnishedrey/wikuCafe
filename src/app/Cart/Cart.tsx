import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import CartComp from "@/src/components/Cart/CartComp";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  const [quantities, setQuantities] = useState(
    Array(menus.length).fill(1) // Initially set quantity to 1 for each item
  );
  const [total, setTotal] = useState(Number(localParams.total));

  const handleIncrease = (index: number) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] += 1;
    setQuantities(updatedQuantities);
    updateTotal(updatedQuantities);
  };

  const handleDecrease = (index: number) => {
    const updatedQuantities = [...quantities];
    if (updatedQuantities[index] > 1) {
      updatedQuantities[index] -= 1;
      setQuantities(updatedQuantities);
      updateTotal(updatedQuantities);
    }
  };

  const updateTotal = (updatedQuantities: number[]) => {
    const newTotal = updatedQuantities.reduce(
      (sum, quantity, index) => sum + quantity * prices[index],
      0
    );
    setTotal(newTotal);
  };

  return (
    <ScrollView>
      <Header />

      <CartComp
        menus={menus}
        itemPrices={prices}
        quantities={quantities}
        total={total}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
      />
    </ScrollView>
  );
};

export default Cart;
